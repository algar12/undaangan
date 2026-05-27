import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];
    let supabaseClient: any = null;

    for (const file of files) {
      const isAudio = file.type.startsWith("audio/") || 
                      /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name);

      if (isAudio) {
        // Initialize Supabase Client dynamically when an audio file is uploaded
        if (!supabaseClient) {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

          if (!supabaseUrl) {
            return NextResponse.json(
              { error: "Environment variable NEXT_PUBLIC_SUPABASE_URL is not defined." },
              { status: 500 }
            );
          }

          if (!supabaseServiceKey) {
            return NextResponse.json(
              { 
                error: "Environment variable SUPABASE_SERVICE_ROLE_KEY is not defined.",
                details: "Please add SUPABASE_SERVICE_ROLE_KEY to allow audio file uploads to Supabase Storage."
              },
              { status: 500 }
            );
          }

          supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
        }

        const bucketName = "uploads";

        // 1. Ensure the bucket exists
        const { data: buckets, error: listError } = await supabaseClient.storage.listBuckets();
        if (listError) {
          console.error("Error listing buckets:", listError);
          throw listError;
        }

        const bucketExists = buckets?.some((b: any) => b.name === bucketName);

        if (!bucketExists) {
          const { error: createBucketError } = await supabaseClient.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 10485760, // 10MB limit
          });

          if (createBucketError) {
            console.error("Error creating bucket:", createBucketError);
            throw createBucketError;
          }
        }

        // 2. Upload to Supabase Storage
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExt = file.name.split(".").pop() || "";
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${uniqueSuffix}.${fileExt}`;

        const { data, error: uploadError } = await supabaseClient.storage
          .from(bucketName)
          .upload(filename, buffer, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          console.error("Error uploading file to storage:", uploadError);
          throw uploadError;
        }

        // 3. Get the public URL
        const { data: { publicUrl } } = supabaseClient.storage
          .from(bucketName)
          .getPublicUrl(filename);

        uploadedUrls.push(publicUrl);
      } else {
        // Save to local filesystem (public/uploads)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // Ensure upload directory exists
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }

        // Create unique filename to prevent overwriting
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);
        
        uploadedUrls.push(`/uploads/${filename}`);
      }
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error: any) {
    console.error("Error in upload handler:", error);
    return NextResponse.json(
      { error: "Failed to upload file", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}


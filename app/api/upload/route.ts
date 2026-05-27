import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // 1. Handle JSON request for Signed Upload URL (bypassing Vercel 4.5MB limit)
    if (contentType.includes("application/json")) {
      const body = await request.json();
      
      if (body.action === "get-signed-url") {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
          return NextResponse.json(
            { error: "Supabase environment variables are missing." },
            { status: 500 }
          );
        }

        const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
        const bucketName = "uploads";

        const { data: buckets } = await supabaseClient.storage.listBuckets();
        const bucketExists = buckets?.some((b: any) => b.name === bucketName);
        if (!bucketExists) {
          await supabaseClient.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 10485760, // 10MB
          });
        }

        const fileExt = body.filename.split(".").pop() || "";
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${uniqueSuffix}.${fileExt}`;

        const { data, error } = await supabaseClient.storage
          .from(bucketName)
          .createSignedUploadUrl(filename);

        if (error) throw error;

        const { data: { publicUrl } } = supabaseClient.storage
          .from(bucketName)
          .getPublicUrl(filename);

        return NextResponse.json({
          signedUrl: data.signedUrl,
          token: data.token,
          path: data.path,
          publicUrl,
        });
      }
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // 2. Handle multipart/form-data for normal file uploads
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
        // Fallback for audio files uploaded via FormData (e.g. from Postman or old clients)
        if (!supabaseClient) {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error("Supabase environment variables missing.");
          }
          supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
        }

        const bucketName = "uploads";
        
        // Ensure bucket exists
        const { data: buckets } = await supabaseClient.storage.listBuckets();
        if (!buckets?.some((b: any) => b.name === bucketName)) {
          await supabaseClient.storage.createBucket(bucketName, { public: true });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExt = file.name.split(".").pop() || "";
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${uniqueSuffix}.${fileExt}`;

        const { error: uploadError } = await supabaseClient.storage
          .from(bucketName)
          .upload(filename, buffer, { contentType: file.type, upsert: false });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabaseClient.storage.from(bucketName).getPublicUrl(filename);
        uploadedUrls.push(publicUrl);
      } else {
        // Save to local filesystem (public/uploads) as requested by user
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


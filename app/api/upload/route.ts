import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client with Service Role Key to bypass RLS and create/write to buckets.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Fallback to anon key if service key is missing
const supabaseClient = supabaseUrl && (supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ? createClient(supabaseUrl, supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  : null;

export async function POST(request: Request) {
  try {
    if (!supabaseClient) {
      throw new Error("Supabase client is not initialized. Check your environment variables.");
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    const bucketName = "uploads";

    // 1. Ensure the bucket exists
    const { data: buckets, error: listError } = await supabaseClient.storage.listBuckets();
    if (listError) {
      console.error("Error listing buckets:", listError);
      throw listError;
    }

    const bucketExists = buckets?.some((b) => b.name === bucketName);

    if (!bucketExists) {
      const { error: createBucketError } = await supabaseClient.storage.createBucket(bucketName, {
        public: true, // Make files publicly accessible
        fileSizeLimit: 10485760, // 10MB limit
      });

      if (createBucketError) {
        console.error("Error creating bucket:", createBucketError);
        throw createBucketError;
      }
    }

    const uploadedUrls: string[] = [];

    // 2. Upload files
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create a unique filename
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


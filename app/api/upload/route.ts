import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      return NextResponse.json(
        { error: "Environment variable NEXT_PUBLIC_SUPABASE_URL is not defined on Vercel." },
        { status: 500 }
      );
    }

    if (!supabaseServiceKey) {
      return NextResponse.json(
        { 
          error: "Environment variable SUPABASE_SERVICE_ROLE_KEY is not defined on Vercel.",
          details: "Please add SUPABASE_SERVICE_ROLE_KEY in your Vercel Project Settings -> Environment Variables to allow server-side uploads."
        },
        { status: 500 }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

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


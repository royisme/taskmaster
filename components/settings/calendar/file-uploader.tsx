'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, Loader2, CheckCircle2, XCircle, File } from 'lucide-react';
import { checkImportedData, uploadAndParseICS } from '@/app/(main)/settings/sync-calendar/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

interface UploadState {
  status: UploadStatus;
  message: string;
  count?: number;
}

export function FileUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    message: ''
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.ics')) {
      setSelectedFile(file);
      setUploadState({ 
        status: 'idle',
        message: `Selected file: ${file.name}`
      });
    } else {
      setUploadState({
        status: 'error',
        message: 'Please select a valid .ics file'
      });
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadState({
        status: 'error',
        message: 'Please select a file first'
      });
      return;
    }

    try {
      setUploadState({ 
        status: 'uploading',
        message: 'Uploading file...'
      });

      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const result = await uploadAndParseICS(formData);

      if (result.success) {

         // 在上传成功后立即检查数据
         const checkResult = await checkImportedData();
 
        setUploadState({
          status: 'success',
          message: `${result.data?.message}. Found ${checkResult.data?.totalCourses} courses across ${checkResult.data?.courseStats.length} days.`,
          count: result.data?.eventsCount
         });
         
        // setUploadState({
        //   status: 'success',
        //   message: result.data?.message ?? 'Upload successful',
        //   count: result.data?.eventsCount
        // });
        setSelectedFile(null);
        
        setTimeout(() => {
          setUploadState({ 
            status: 'idle',
            message: ''
          });
        }, 3000);


      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setUploadState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to upload file'
      });
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="space-y-4 p-6">
        {/* Status Alerts */}
        {uploadState.status !== 'idle' && uploadState.message && (
          <Alert variant={uploadState.status === 'error' ? 'destructive' : 'default'}>
            <AlertDescription className="flex items-center gap-2">
              {uploadState.status === 'uploading' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : uploadState.status === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              {uploadState.message}
            </AlertDescription>
          </Alert>
        )}

        {/* File Upload Zone */}
        <div className="grid w-full items-center gap-4">
          <div className={cn(
            "flex flex-col items-center justify-center rounded-lg border border-dashed p-8",
            "hover:bg-accent/40 transition-colors",
            uploadState.status === 'uploading' && "pointer-events-none opacity-60"
          )}>
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop or click to upload your .ics file
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".ics"
                onChange={handleFileSelect}
                disabled={uploadState.status === 'uploading'}
              />
              <Button 
                variant="secondary" 
                disabled={uploadState.status === 'uploading'}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Choose File
              </Button>
            </div>
          </div>
        </div>

        {/* Selected File Display */}
        {selectedFile && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleUpload}
                  disabled={uploadState.status === 'uploading'}
                >
                  {uploadState.status === 'uploading' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload'
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <span className="sr-only">Actions</span>
                      {/* Add your preferred icon here */}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedFile(null)}>
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {uploadState.status === 'uploading' && (
              <Progress value={66} className="mt-2" />
            )}
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SystemController extends Controller
{
    // TODO: remove
    public function getTmpImage(Request $request)
    {
        return Storage::disk('tmp')->get($request->name);
    }

    public function uploadImage(Request $request)
    {
        $messages = [
            'file.required' => 'File is required.',
            'file.image' => 'The file must be an image.',
            'type.required' => 'Type is required.',
        ];

        $validator = Validator::make(
            $request->all(),
            [
                'file' => 'required|image',
                'type' => 'required',
            ],
            $messages
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('file');
        $filename = uniqid().time().'.'.$file->getClientOriginalExtension();
        $type = $request->type;
        $path = '';

        if ($type == 'post') {
            $path = 'posts_images';
        }

        Storage::disk($path)->put($filename, file_get_contents($file));

        $image = Image::create([
            'name' => $filename,
            'path' => $path,
            'status' => false,
        ]);

        $imgUrl = Storage::disk($path)->url($filename);

        return [
            'image' => [
                'id' => $image->id,
                'name' => $image->name,
                'url' => $imgUrl,
            ],
        ];
    }

    public function createContactMessage(Request $request)
    {
        $name = $request->name;
        $subject = $request->subject;
        $email = $request->email;
        $description = $request->description;

        ContactMessage::create([
            'name' => $name,
            'subject' => $subject,
            'email' => $email,
            'description' => $description,
        ]);

        Mail::send('emails.emailContact', ['name' => $request['name']], function (
            $message
        ) {
            $message->to('contacto@dowar.xyz');
            $message->subject('Confirmación de contacto');
        });
    }

    // TODO: remove
    public function getImage(Request $request)
    {
        $imageName = $request->input('name');
        $image = DB::table('images')->where('name', $imageName)->first();
        $diskName = $image->path;
        $url = Storage::disk($diskName)->url($imageName);

        return response()->json(
            [
                'id' => $image->id,
                'name' => $image->name,
                'url' => $url,
            ],
            200
        );
    }

    public function serveImage(Request $request)
    {
        $path = $request->input('path');

        if (! $path) {
            return response()->json(['error' => 'Path is required'], 400);
        }

        $safePath = storage_path('app/public/'.$path);

        if (! file_exists($safePath) || ! is_readable($safePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $extension = strtolower(pathinfo($safePath, PATHINFO_EXTENSION));
        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'ico' => 'image/x-icon',
        ];

        $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';

        $response = response()->make(file_get_contents($safePath), 200, [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'public, max-age=31536000',
        ]);

        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        $response->headers->set('Access-Control-Allow-HEADERS', 'Content-Type');

        return $response;
    }
}

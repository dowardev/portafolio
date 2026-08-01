<?php

namespace App\Console\Commands;

use App\Models\HomePage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanHomepageImages extends Command
{
    protected $signature = 'homepage:clean-images {--dry-run : Show what would be deleted without actually deleting}';

    protected $description = 'Remove orphaned images from the homepage storage that are no longer in the database';

    private array $folders = [
        'homepage',
        'homepage/skills',
        'homepage/experience',
        'homepage/experience/tech',
        'homepage/projects',
        'homepage/projects/source',
        'homepage/projects/tech',
        'homepage/certificates',
        'homepage/certificates/apt',
        'homepage/freelance',
        'homepage/freelance/comments',
    ];

    public function handle(): int
    {
        $homepage = HomePage::first();
        if (! $homepage) {
            $this->info('No homepage record found. Nothing to clean.');

            return Command::SUCCESS;
        }

        $dbUrls = $this->getAllDatabaseImageUrls($homepage);
        $this->info('Found '.count($dbUrls).' images in database.');

        $filePaths = $this->getAllFilePaths();
        $this->info('Found '.count($filePaths).' files in storage.');

        $orphaned = array_diff($filePaths, $dbUrls);
        $orphanCount = count($orphaned);

        if ($orphanCount === 0) {
            $this->info('No orphaned images found.');

            return Command::SUCCESS;
        }

        $this->warn("Found {$orphanCount} orphaned image(s):");
        foreach ($orphaned as $path) {
            $this->line("  - {$path}");
        }

        if ($this->option('dry-run')) {
            $this->info("\nDry run: no files were deleted.");

            return Command::SUCCESS;
        }

        if (! $this->confirm("Do you want to delete these {$orphanCount} file(s)?")) {
            $this->info('Operation cancelled.');

            return Command::SUCCESS;
        }

        $deleted = 0;
        foreach ($orphaned as $path) {
            if (Storage::disk('public')->delete($path)) {
                $deleted++;
            }
        }

        $this->info("Deleted {$deleted} orphaned image(s).");

        return Command::SUCCESS;
    }

    private function getAllDatabaseImageUrls(HomePage $homepage): array
    {
        $urls = [];

        if ($homepage->logo_url) {
            $urls[] = $this->pathFromUrl($homepage->logo_url);
        }
        if ($homepage->photo_url) {
            $urls[] = $this->pathFromUrl($homepage->photo_url);
        }

        foreach ($homepage->skill_categories ?? [] as $category) {
            foreach ($category['technologies'] ?? [] as $tech) {
                if (! empty($tech['image'])) {
                    $urls[] = $this->pathFromUrl($tech['image']);
                }
            }
        }

        foreach ($homepage->experience ?? [] as $exp) {
            if (! empty($exp['img'])) {
                $urls[] = $this->pathFromUrl($exp['img']);
            }
            foreach ($exp['technologies'] ?? [] as $tech) {
                if (! empty($tech['source'])) {
                    $urls[] = $this->pathFromUrl($tech['source']);
                }
            }
        }

        foreach ($homepage->projects ?? [] as $project) {
            if (! empty($project['img'])) {
                $urls[] = $this->pathFromUrl($project['img']);
            }
            if (! empty($project['source']['img'])) {
                $urls[] = $this->pathFromUrl($project['source']['img']);
            }
            foreach ($project['technologies'] ?? [] as $tech) {
                if (! empty($tech['source'])) {
                    $urls[] = $this->pathFromUrl($tech['source']);
                }
            }
        }

        foreach ($homepage->certificates ?? [] as $cert) {
            if (! empty($cert['img'])) {
                $urls[] = $this->pathFromUrl($cert['img']);
            }
            foreach ($cert['aptitudes'] ?? [] as $apt) {
                if (! empty($apt['source'])) {
                    $urls[] = $this->pathFromUrl($apt['source']);
                }
            }
        }

        foreach ($homepage->freelance ?? [] as $platform) {
            if (! empty($platform['image'])) {
                $urls[] = $this->pathFromUrl($platform['image']);
            }
            foreach ($platform['comments'] ?? [] as $comment) {
                if (! empty($comment['image'])) {
                    $urls[] = $this->pathFromUrl($comment['image']);
                }
            }
        }

        return $urls;
    }

    private function pathFromUrl(string $url): string
    {
        $baseUrl = config('app.url');
        if (str_starts_with($url, $baseUrl)) {
            return ltrim(str_replace($baseUrl, '', $url), '/');
        }

        return ltrim(str_replace(asset(''), '', $url), '/');
    }

    private function getAllFilePaths(): array
    {
        $paths = [];
        foreach ($this->folders as $folder) {
            $files = Storage::disk('public')->files($folder);
            $paths = array_merge($paths, $files);
        }

        return $paths;
    }
}

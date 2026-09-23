import { SongForm } from "./SongForm";

// Writing a 30-day plan takes about a minute.
export const maxDuration = 300;

export default function NewSongPage() {
  return (
    <div className="space-y-6 pt-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Tell me about your song</h1>
        <p className="text-muted">Answer in your own words. The more honest you are, the better your plan.</p>
      </div>
      <SongForm />
    </div>
  );
}

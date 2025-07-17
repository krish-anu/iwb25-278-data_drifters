import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ShopPage() {
  return (
    <div className="flex justify-center pt-10">
      <div className="flex w-full max-w-3xl items-center gap-4 px-4">
        <Input
          type="text"
          placeholder="Search in your local store.."
          className="h-14 px-8 text-base rounded-x1 px-5 flex-grow"
        />
        <Button
          type="button"
          className="h-14 px-6 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        >
          Search
        </Button>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";

export type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  shopId: string;
  mallId?: string;
};

type Props = Product & {
  onClick?: () => void;
  onOrderNow?: () => void;
};

export default function ProductCard({
  id,
  name,
  image,
  price,
  shopId,
  onClick,
  onOrderNow,
}: Props) {
  return (
    <div className="rounded-xl border p-3 hover:shadow-sm transition">
      <div
        className="aspect-square w-full overflow-hidden rounded-lg bg-muted cursor-pointer"
        onClick={onClick}
      >
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={image} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="mt-3">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">
          LKR {price.toLocaleString("en-LK")}
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClick}>
          View
        </Button>
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700"
          onClick={onOrderNow}
        >
          Order Now
        </Button>
      </div>
    </div>
  );
}

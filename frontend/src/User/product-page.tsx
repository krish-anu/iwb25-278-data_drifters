import { useParams } from "react-router-dom";

export function ProductPage() {
  const { id } = useParams();

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">Product ID: {id}</h1>
      <p className="mt-4 text-gray-600">This is the product detail page.</p>
    </div>
  );
}

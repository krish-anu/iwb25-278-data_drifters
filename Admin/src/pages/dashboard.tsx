import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { ProductTable } from "@/components/product-table";
// import { Header } from '@/components/header';
import { Card, CardHeader, CardContent } from "@/components/ui/card";

function Dashboard() {
  return (
    <>
      {/* <div className='p-10'>
        <Header />
      </div> */}
      <div>
        <ChartAreaInteractive />
      </div>
      <div className="inline-block pt-6 pb-3 w-1/2 pr-3">
        <Card className="overflow-hidden p-0">
          <CardHeader className="flex items-center justify-between pt-6">
            Total Revenue
          </CardHeader>
          <CardContent className="flex items-start justify-between text-2xl pb-8">
            LKR 1,000,000
          </CardContent>
        </Card>
      </div>
      <div className="inline-block pt-6 pb-3 w-1/2 pl-3">
        <Card className="overflow-hidden p-0">
          <CardHeader className="flex items-center justify-between pt-6">
            Total Revenue
          </CardHeader>
          <CardContent className="flex items-start justify-between text-2xl pb-8">
            LKR 1,000,000
          </CardContent>
        </Card>
      </div>
      <div className="inline-block pt-3 pb-3 w-1/2 pr-3">
        <Card className="overflow-hidden p-0">
          <CardHeader className="flex items-center justify-between pt-6">
            Total Revenue
          </CardHeader>
          <CardContent className="flex items-start justify-between text-2xl pb-8">
            LKR 1,000,000
          </CardContent>
        </Card>
      </div>
      <div className="inline-block pt-3 pb-3 w-1/2 pl-3">
        <Card className="overflow-hidden p-0">
          <CardHeader className="flex items-center justify-between pt-6">
            Total Revenue
          </CardHeader>
          <CardContent className="flex items-start justify-between text-2xl pb-8">
            LKR 1,000,000
          </CardContent>
        </Card>
      </div>
      <div>
        <ProductTable />
      </div>
    </>
  );
}

export default Dashboard;

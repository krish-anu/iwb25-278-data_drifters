import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function ProductTable() {
    return (
        <Table>
        <TableCaption>Product Sales Ranking (Most to Least Sold)</TableCaption>
        <TableHeader>
            <TableRow>
            <TableHead className="w-[100px] text-center">Rank</TableHead>
            <TableHead className="text-center">Product</TableHead>
            <TableHead className="text-center">Units Sold</TableHead>
            <TableHead className="text-right">Amount (LKR)</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
            <TableCell className="font-medium">1</TableCell>
            <TableCell>Premium Rice 10kg</TableCell>
            <TableCell>2,340</TableCell>
            <TableCell className="text-right">1,404,000</TableCell>
            </TableRow>
        </TableBody>
        <TableBody>
            <TableRow>
            <TableCell className="font-medium">2</TableCell>
            <TableCell>Fresh Milk 1L</TableCell>
            <TableCell>1,880</TableCell>
            <TableCell className="text-right">282,000</TableCell>
            </TableRow>
        </TableBody>
        <TableBody>
            <TableRow>
            <TableCell className="font-medium">3</TableCell>
            <TableCell>White Bread Loaf</TableCell>
            <TableCell>1,720</TableCell>
            <TableCell className="text-right">206,400</TableCell>
            </TableRow>
        </TableBody>                
        </Table>
    );
}

export { ProductTable }
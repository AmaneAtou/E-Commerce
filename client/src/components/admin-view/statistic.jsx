import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

function AdminStatistic() {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/statistics/products", {
        withCredentials: true,
      })
      .then((res) => {
        setStatistics(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching statistics:", err);
        setLoading(false);
      });
  }, []);

  // Tính tổng doanh thu
  const totalRevenue = statistics.reduce(
    (sum, item) => sum + Number(item.revenue || 0),
    0
  );

  if (loading) return <div className="p-4 text-gray-600">Loading statistics...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Product Statistics</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Product Name</TableHead>
            <TableHead className="text-center">Sold</TableHead>
            <TableHead className="text-center">Revenue ($)</TableHead>
            <TableHead className="text-center">Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statistics.map((item) => (
            <TableRow key={item.productId}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell className="text-center">{item.sold}</TableCell>
              <TableCell className="text-center text-green-700">
                ${item.revenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell className="text-center">{item.stock}</TableCell>
            </TableRow>
          ))}
          {/* Thêm 1 hàng tổng doanh thu */}
          <TableRow>
            <TableCell className="font-semibold">Total Revenue</TableCell>
            <TableCell />
            <TableCell className="text-center text-green-900 font-semibold">
              ${totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminStatistic;

import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const initialFormData = {
  status: "",
};

// Hàm helper để lấy class màu tương ứng với trạng thái
function getStatusBadgeColor(status) {
  switch (status) {
    case "pending":
      return "bg-gray-500";
    case "inProcess":
      return "bg-yellow-500";
    case "inShipping":
      return "bg-blue-500";
    case "delivered":
      return "bg-green-600";
    case "rejected":
      return "bg-red-600";
    case "confirmed":
      return "bg-green-500";
    default:
      return "bg-black";
  }
}

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(updateOrderStatus({ id: orderDetails?._id, orderStatus: status })).then(
      (data) => {
        if (data?.payload?.success) {
          dispatch(getOrderDetailsForAdmin(orderDetails?._id));
          dispatch(getAllOrdersForAdmin());
          setFormData(initialFormData);
          toast({
            title: data?.payload?.message,
          });
        }
      }
    );
  }

  // Hàm in hóa đơn: chỉ in phần có id "print-area"
  function handlePrintInvoice() {
    const printContents = document.getElementById("print-area").innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Holistae</title>");
    printWindow.document.write(
      `<style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .bg-gray-500 { background-color: #6b7280; color: white; padding: 2px 8px; border-radius: 4px;}
        .bg-yellow-500 { background-color: #f59e0b; color: white; padding: 2px 8px; border-radius: 4px;}
        .bg-blue-500 { background-color: #3b82f6; color: white; padding: 2px 8px; border-radius: 4px;}
        .bg-green-600 { background-color: #16a34a; color: white; padding: 2px 8px; border-radius: 4px;}
        .bg-red-600 { background-color: #dc2626; color: white; padding: 2px 8px; border-radius: 4px;}
        .bg-green-500 { background-color: #22c55e; color: white; padding: 2px 8px; border-radius: 4px;}
        .font-medium { font-weight: 500; }
        .text-muted-foreground { color: #6b7280; }
        .grid { display: grid; gap: 0.5rem; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .text-white { color: white; }
        span { display: block; margin-bottom: 4px; }
      </style>`
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write(printContents);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  return (
    <DialogContent className="sm:max-w-[800px] max-h-[110vh] overflow-hidden flex flex-col">
      <DialogTitle>
        <VisuallyHidden>Chi tiết đơn hàng quản trị</VisuallyHidden>
      </DialogTitle>

      {/* Bao ngoài nội dung có thể scroll */}
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="grid gap-6">
          {/* Phần bao ngoài 3 phần cần in */}
          <div id="print-area">
            {/* Thông tin đơn hàng */}
            <div className="grid gap-2">
              <div className="flex mt-6 items-center justify-between">
                <p className="font-medium">Order ID</p>
                <Label>{orderDetails?._id}</Label>
              </div>
              <div className="flex mt-2 items-center justify-between">
                <p className="font-medium">Order Date</p>
                <Label>{orderDetails?.orderDate?.split("T")[0]}</Label>
              </div>
              <div className="flex mt-2 items-center justify-between">
                <p className="font-medium">Order Price</p>
                <Label>${orderDetails?.totalAmount}</Label>
              </div>
              <div className="flex mt-2 items-center justify-between">
                <p className="font-medium">Payment method</p>
                <Label>{orderDetails?.paymentMethod}</Label>
              </div>
              <div className="flex mt-2 items-center justify-between">
                <p className="font-medium">Payment Status</p>
                <Label>{orderDetails?.paymentStatus}</Label>
              </div>
              <div className="flex mt-2 items-center justify-between">
                <p className="font-medium">Order Status</p>
                <Badge
                  className={`py-1 px-3 text-white ${getStatusBadgeColor(
                    orderDetails?.orderStatus
                  )}`}
                >
                  {orderDetails?.orderStatus}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Chi tiết đơn hàng */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="font-medium">Order Details</div>
                <ul className="grid gap-3 max-h-[150px] overflow-y-auto pr-1">
                  {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                    ? orderDetails.cartItems.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>Title: {item.title}</span>
                          <span>Quantity: {item.quantity}</span>
                          <span>Price: ${item.price}</span>
                        </li>
                      ))
                    : null}
                </ul>
              </div>
            </div>

            {/* Thông tin vận chuyển */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="font-medium">Shipping Info</div>
                <div className="grid gap-0.5 text-muted-foreground text-sm max-h-[120px] overflow-y-auto pr-1">
                  <span>{user?.userName}</span>
                  <span>{orderDetails?.addressInfo?.address}</span>
                  <span>{orderDetails?.addressInfo?.city}</span>
                  <span>{orderDetails?.addressInfo?.pincode}</span>
                  <span>{orderDetails?.addressInfo?.phone}</span>
                  <span>{orderDetails?.addressInfo?.notes}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form cập nhật trạng thái */}
          <div>
            <CommonForm
              formControls={[
                {
                  label: "Order Status",
                  name: "status",
                  componentType: "select",
                  options: [
                    { id: "pending", label: "Pending" },
                    { id: "inProcess", label: "In Process" },
                    { id: "inShipping", label: "In Shipping" },
                    { id: "delivered", label: "Delivered" },
                    { id: "rejected", label: "Rejected" },
                  ],
                },
              ]}
              formData={formData}
              setFormData={setFormData}
              buttonText={"Update Order Status"}
              onSubmit={handleUpdateStatus}
            />
          </div>

          {/* Nút in hóa đơn */}
          <div className="mt-4">
            <button
              onClick={handlePrintInvoice}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              In hóa đơn
            </button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;

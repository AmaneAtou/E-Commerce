import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  gender: "",
  price: "",
  salePrice: 0, // Mặc định 0
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const isFormValid = () => {
    const requiredFields = [
      "title",
      "description",
      "category",
      "gender",
      "price",
      "totalStock",
      "image",
    ];
    return requiredFields.every((key) => formData[key] !== "");
  };

  const handleEdit = (product) => {
    setCurrentEditedId(product._id);
    setFormData({
      image: product.image || null,
      title: product.title || "",
      description: product.description || "",
      category: product.category || "",
      gender: product.gender || "",
      price: product.price || "",
      salePrice: product.salePrice ?? 0,
      totalStock: product.totalStock || "",
      averageReview: product.averageReview || 0,
    });
    setUploadedImageUrl(product.image || "");
    setImageFile(null);
    setOpenCreateProductsDialog(true);
  };

  const handleOpenAddNewProduct = () => {
    setFormData(initialFormData);
    setImageFile(null);
    setUploadedImageUrl("");
    setCurrentEditedId(null);
    setOpenCreateProductsDialog(true);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return; 

    setIsSubmitting(true);

    const productData = {
      ...formData,
      image: uploadedImageUrl || formData.image,
      price: Number(formData.price),
      salePrice: formData.salePrice === "" ? 0 : Number(formData.salePrice),
      totalStock: Number(formData.totalStock),
    };

    const isEditing = currentEditedId !== null;
    const action = isEditing
      ? editProduct({ id: currentEditedId, formData: productData })
      : addNewProduct(productData);

    try {
      const data = await dispatch(action).unwrap();

      if (data?.success) {
        toast({
          title: isEditing ? "Product edited successfully" : "Product added successfully",
        });

        dispatch(fetchAllProducts());

        setFormData(initialFormData);
        setOpenCreateProductsDialog(false);
        setCurrentEditedId(null);
        setImageFile(null);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setIsSubmitting(false); 
    }
  };


  const handleDelete = (productId) => {
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ title: "Product deleted successfully" });
      }
    });
  };

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={handleOpenAddNewProduct}>Add New Product</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList?.length > 0 &&
          productList.map((productItem) => (
            <AdminProductTile
              key={productItem._id || productItem.title}
              product={productItem}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))}
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(open) => {
          if (!open) {
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
            setTimeout(() => {
              setOpenCreateProductsDialog(false);
              setCurrentEditedId(null);
              setFormData(initialFormData);
              setUploadedImageUrl("");
              setImageFile(null);
            }, 50);
          } else {
            setOpenCreateProductsDialog(true);
          }
        }}
      >
        <SheetContent
          key={currentEditedId !== null ? `edit-${currentEditedId}` : "create-new"}
          side="right"
          className="overflow-auto"
        >
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;

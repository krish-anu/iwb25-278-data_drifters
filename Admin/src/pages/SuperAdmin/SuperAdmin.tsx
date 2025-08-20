import Header from "@/components/header";
import ProductGrid from "@/components/shop-grid";

const SuperAdmin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProductGrid />
    </div>
  );
};

export default SuperAdmin;

// export default function PendingAdmins({ token }: { token: string }) {
//   const [admins, setAdmins] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchAdmins() {
//       try {
//         const data = await getPendingAdmins(token);
//         setAdmins(data.users || []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchAdmins();
//   }, [token]);

//   const handleApprove = async (id: string) => {
//     try {
//       await approveAdmin(id, token);
//       setAdmins(admins.filter(admin => admin._id !== id)); // remove approved admin from list
//       alert("Admin approved successfully!");
//     } catch (err) {
//       alert("Failed to approve admin");
//     }
//   };

//   if (loading) return <p>Loading pending admins...</p>;
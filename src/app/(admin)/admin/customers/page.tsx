import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Users, Search } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils/format";

type SearchParams = {
  search?: string;
  page?: string;
};

async function getCustomers(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 15;
  const search = searchParams.search || "";

  const where: Record<string, unknown> = {
    role: "CUSTOMER",
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: { orders: true },
        },
        orders: {
          select: { total: true },
          where: { paymentStatus: "COMPLETED" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  const customersWithTotalSpent = customers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    createdAt: c.createdAt,
    ordersCount: c._count.orders,
    totalSpent: c.orders.reduce((sum, o) => sum + o.total, 0),
  }));

  return {
    customers: customersWithTotalSpent,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const { customers, pagination } = await getCustomers(searchParams);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl text-charcoal-100">Customers</h1>
        <p className="text-charcoal-400 text-sm mt-1">
          {pagination.total} customer{pagination.total !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* Search */}
      <form method="GET" className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
        <input
          type="text"
          name="search"
          defaultValue={searchParams.search || ""}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 bg-charcoal-900 border border-charcoal-700 rounded-lg text-sm text-charcoal-100 placeholder:text-charcoal-500 focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/20 transition-colors"
        />
      </form>

      {/* Customers Table */}
      <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-700/50">
                <th className="text-left text-xs font-medium text-charcoal-400 uppercase tracking-wider px-5 py-3">
                  Customer
                </th>
                <th className="text-left text-xs font-medium text-charcoal-400 uppercase tracking-wider px-5 py-3">
                  Email
                </th>
                <th className="text-left text-xs font-medium text-charcoal-400 uppercase tracking-wider px-5 py-3">
                  Orders
                </th>
                <th className="text-left text-xs font-medium text-charcoal-400 uppercase tracking-wider px-5 py-3">
                  Total Spent
                </th>
                <th className="text-left text-xs font-medium text-charcoal-400 uppercase tracking-wider px-5 py-3">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-800">
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-charcoal-400"
                  >
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No customers found</p>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-charcoal-800/50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-gold-400 text-sm font-semibold">
                            {customer.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-charcoal-100">
                          {customer.name || "Anonymous"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-charcoal-300">
                      {customer.email}
                    </td>
                    <td className="px-5 py-3 text-sm text-charcoal-200">
                      {customer.ordersCount}
                    </td>
                    <td className="px-5 py-3 text-sm text-charcoal-200 font-medium">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="px-5 py-3 text-sm text-charcoal-400">
                      {formatDate(customer.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-5 py-3 border-t border-charcoal-700/50 flex items-center justify-between">
            <p className="text-sm text-charcoal-400">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              {pagination.page > 1 && (
                <a
                  href={`/admin/customers?page=${pagination.page - 1}${
                    searchParams.search ? `&search=${searchParams.search}` : ""
                  }`}
                  className="px-3 py-1.5 text-sm text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-800 rounded-lg transition-colors border border-charcoal-700"
                >
                  Previous
                </a>
              )}
              {pagination.page < pagination.totalPages && (
                <a
                  href={`/admin/customers?page=${pagination.page + 1}${
                    searchParams.search ? `&search=${searchParams.search}` : ""
                  }`}
                  className="px-3 py-1.5 text-sm text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-800 rounded-lg transition-colors border border-charcoal-700"
                >
                  Next
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

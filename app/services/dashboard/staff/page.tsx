"use client";

import DashboardSidebar from "@/app/components/services/DashboardSidebar";
import DashboardNavbar from "@/app/components/services/DashboardNavbar";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: "Active" | "On Break";
  phone: string;
  email: string;
  joined: string;
  image: string;
}

const staffMembers: StaffMember[] = [
  {
    id: 1,
    name: "Alex Thompson",
    role: "Head Chef",
    status: "Active",
    phone: "+91 98765 43210",
    email: "alex@restaurant.com",
    joined: "Jan 2023",
    image: "/alex.png",
  },
  {
    id: 2,
    name: "Maria Garcia",
    role: "Sous Chef",
    status: "Active",
    phone: "+91 98765 43211",
    email: "maria@restaurant.com",
    joined: "Mar 2023",
    image: "/maria.jpg",
  },
  {
    id: 3,
    name: "James Wilson",
    role: "Waiter",
    status: "On Break",
    phone: "+91 98765 43212",
    email: "james@restaurant.com",
    joined: "May 2023",
    image: "/james.jpg",
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Bartender",
    phone: "+91 98765 43213",
    email: "emily@restaurant.com",
    joined: "Feb 2023",
    status: "Active",
    image: "/emily.jpg",
  },
];

const statusColors = {
  Active: "bg-green-100 text-green-800",
  "On Break": "bg-yellow-100 text-yellow-800",
};

export default function StaffManagementPage() {
  const handleEdit = (id: number) => {
    console.log(`Edit staff with ID: ${id}`);
    // TODO: Implement edit functionality (e.g., open modal or navigate to edit page)
    alert(`Edit ${staffMembers.find(member => member.id === id)?.name}`);
  };

  const handleMoreOptions = (id: number) => {
    console.log(`More options for staff with ID: ${id}`);
    // TODO: Implement more options dropdown
    alert(`More options for ${staffMembers.find(member => member.id === id)?.name}`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, memberName: string) => {
    (e.target as HTMLImageElement).src = `https://via.placeholder.com/150x150?text=${encodeURIComponent(memberName)}`;
  };

  return (
    <div className="flex">
      <DashboardSidebar />

      <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen">
        <DashboardNavbar
          title="Staff Management"
          subtitle="Manage your restaurant team members"
        />

        <div className="bg-white p-6 rounded-lg mt-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Staff Members</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>+ Add Staff</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {staffMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                    onError={(e) => handleImageError(e, member.name)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">{member.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[member.status]}`}>
                        {member.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{member.role}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h9M8.25 18h6" />
                        </svg>
                        {member.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.875 1.767l-5.27 3.053A2.25 2.25 0 0016 10.545v-5.662m0 10.107a2.25 2.25 0 01-.875-.727l-5.27-3.053a2.25 2.25 0 00-1.5 0l-5.27 3.053a2.25 2.25 0 01-.875.727m15 0v3.375c0 .621-.504 1.125-1.125 1.125H4.125C3.504 21 3 20.496 3 19.875V15m0 0v.243a2.25 2.25 0 01.875 1.767l5.27 3.053a2.25 2.25 0 001.5 0l5.27-3.053a2.25 2.25 0 01.875-.727m-17 0v.243a2.25 2.25 0 01.875 1.767L7.5 21m7.5 0l5.27-3.053A2.25 2.25 0 0019.125 15v-5.662" />
                        </svg>
                        {member.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25m0 0h2.25m-2.25 0h-2.25m6 3V21a9 9 0 11-18 0V8.25m3 0H18m10.5 0h.25M2.25 8.25h.25M21 18a2.25 2.25 0 01-2.25 2.25m0-2.25a2.25 2.25 0 00-2.25-2.25m0 0H21m0 0h-.25M2.25 18a2.25 2.25 0 01-2.25 2.25m0 0H2.25m0-2.25a2.25 2.25 0 00-2.25-2.25M2.25 15.75v3.75" />
                        </svg>
                        Joined: {member.joined}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleEdit(member.id)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-1 hover:bg-blue-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleMoreOptions(member.id)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                        title="More options"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.586l1.293.707L15 7.414V10M9 16H5m0 0l-1.293-.707a1 1 0 00-1.414 1.414L3 18h2zM6 15v5m6-5l1.293-.707a1 1 0 011.414 1.414L15 18h-2m3-3v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5a1 1 0 011-1h2a1 1 0 011 1z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
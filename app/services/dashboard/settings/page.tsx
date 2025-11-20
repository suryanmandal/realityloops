"use client";

import { useState } from "react";
import DashboardSidebar from "@/app/components/services/DashboardSidebar";
import DashboardNavbar from "@/app/components/services/DashboardNavbar";
import { Save, Edit3, Clock, CreditCard, Smartphone, DollarSign, Wallet } from "lucide-react";

interface RestaurantSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface NotificationSettings {
  newOrderAlerts: boolean;
  lowStockAlerts: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

interface OperatingHours {
  mondayFriday: string;
  saturday: string;
  sunday: string;
}

interface PaymentMethods {
  creditDebitCards: boolean;
  upiPayments: boolean;
  cashOnDelivery: boolean;
  digitalWallets: boolean;
}

const initialRestaurantSettings: RestaurantSettings = {
  name: "RestaurantOS",
  email: "contact@restaurant.com",
  phone: "+91 98765 00000",
  address: "123 Main Street, Mumbai, Maharashtra 400001",
};

const initialNotificationSettings: NotificationSettings = {
  newOrderAlerts: true,
  lowStockAlerts: true,
  emailNotifications: false,
  smsNotifications: true,
};

const initialOperatingHours: OperatingHours = {
  mondayFriday: "10:00 AM - 11:00 PM",
  saturday: "10:00 AM - 12:00 AM",
  sunday: "11:00 AM - 11:00 PM",
};

const initialPaymentMethods: PaymentMethods = {
  creditDebitCards: true,
  upiPayments: true,
  cashOnDelivery: true,
  digitalWallets: false,
};

export default function SettingsPage() {
  const [restaurantSettings, setRestaurantSettings] = useState(initialRestaurantSettings);
  const [notificationSettings, setNotificationSettings] = useState(initialNotificationSettings);
  const [operatingHours, setOperatingHours] = useState(initialOperatingHours);
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [editingHours, setEditingHours] = useState(false);

  const handleSaveChanges = () => {
    console.log("Saving changes:", { restaurantSettings, notificationSettings });
    alert("Settings saved successfully!");
  };

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePaymentMethod = (key: keyof PaymentMethods) => {
    setPaymentMethods(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEditHours = () => {
    setEditingHours(!editingHours);
    if (editingHours) {
      // Save hours logic here
      console.log("Saving hours:", operatingHours);
    }
  };

  return (
    <div className="flex">
      <DashboardSidebar />

      <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen">
        <DashboardNavbar
          title="Settings"
          subtitle="Manage your restaurant configuration"
        />

        {/* Restaurant and Notification Settings */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Restaurant Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                <input
                  type="text"
                  value={restaurantSettings.name}
                  onChange={(e) => setRestaurantSettings(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={restaurantSettings.email}
                  onChange={(e) => setRestaurantSettings(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={restaurantSettings.phone}
                  onChange={(e) => setRestaurantSettings(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={restaurantSettings.address}
                  onChange={(e) => setRestaurantSettings(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleSaveChanges}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                <div>
                  <h4 className="font-medium text-blue-900">New Order Alerts</h4>
                  <p className="text-sm text-blue-700">Get notified for new orders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.newOrderAlerts}
                    onChange={() => toggleNotification("newOrderAlerts")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                <div>
                  <h4 className="font-medium text-green-900">Low Stock Alerts</h4>
                  <p className="text-sm text-green-700">Alert when inventory is low</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.lowStockAlerts}
                    onChange={() => toggleNotification("lowStockAlerts")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-700">Receive email updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={() => toggleNotification("emailNotifications")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-md">
                <div>
                  <h4 className="font-medium text-red-900">SMS Notifications</h4>
                  <p className="text-sm text-red-700">Receive SMS alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsNotifications}
                    onChange={() => toggleNotification("smsNotifications")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Operating Hours and Payment Methods */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Operating Hours
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Monday - Friday</span>
                <span className="text-sm text-gray-500">{operatingHours.mondayFriday}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Saturday</span>
                <span className="text-sm text-gray-500">{operatingHours.saturday}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Sunday</span>
                <span className="text-sm text-gray-500">{operatingHours.sunday}</span>
              </div>
              <button
                onClick={handleEditHours}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 mt-4"
              >
                <Edit3 className="w-4 h-4" />
                <span>{editingHours ? "Save Hours" : "Edit Hours"}</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Methods
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Credit/Debit Cards</h4>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentMethods.creditDebitCards}
                    onChange={() => togglePaymentMethod("creditDebitCards")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${paymentMethods.creditDebitCards ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {paymentMethods.creditDebitCards ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-md">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">UPI Payments</h4>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentMethods.upiPayments}
                    onChange={() => togglePaymentMethod("upiPayments")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${paymentMethods.upiPayments ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {paymentMethods.upiPayments ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Cash on Delivery</h4>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentMethods.cashOnDelivery}
                    onChange={() => togglePaymentMethod("cashOnDelivery")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${paymentMethods.cashOnDelivery ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {paymentMethods.cashOnDelivery ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-md">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-5 h-5 text-orange-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Digital Wallets</h4>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentMethods.digitalWallets}
                    onChange={() => togglePaymentMethod("digitalWallets")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${paymentMethods.digitalWallets ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {paymentMethods.digitalWallets ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
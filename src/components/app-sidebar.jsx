import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Settings,
  Users,
} from "lucide-react";

const NAVIGATION_CONFIG = [
  {
    title: "Dashboard",
    url: "/home",
    icon: Frame,
  },
  {
    title: "Master",
    url: "#",
    icon: Settings,
    items: [
      {
        title: "Buyer",
        url: "/master/buyer",
        icon: Users,
      },
      {
        title: "Bag Type",
        url: "/master/bag-type",
        icon: Users,
      },
      {
        title: "Bank",
        url: "/master/bank",
        icon: Users,
      },
      {
        title: "Container Size",
        url: "/master/containersize",
        icon: Users,
      },
      {
        title: "Country",
        url: "/master/country",
        icon: Users,
      },
      {
        title: "Gr Code",
        url: "/master/grcode",
        icon: Users,
      },
      {
        title: "Marking",
        url: "/master/marking",
        icon: Users,
      },
      {
        title: "Order Type",
        url: "/master/order-type",
        icon: Users,
      },
      {
        title: "Payment Term",
        url: "/master/payment-term",
        icon: Users,
      },
      {
        title: "Port of Loading",
        url: "/master/port-of-loading",
        icon: Users,
      },
      {
        title: "Pre Recepit",
        url: "/master/pre-recepit",
        icon: Users,
      },
      {
        title: "Product",
        url: "/master/product",
        icon: Users,
      },
      {
        title: "Scheme",
        url: "/master/scheme",
        icon: Users,
      },
      {
        title: "Shipper",
        url: "/master/shipper",
        icon: Users,
      },
      {
        title: "Vessel",
        url: "/master/vessel",
        icon: Users,
      },
      {
        title: "Company",
        url: "/master/branch",
        icon: Users,
      },
      {
        title: "State",
        url: "/master/state",
        icon: Users,
      },
      {
        title: "Item",
        url: "/master/item",
        icon: Users,
      },
      {
        title: "Pre Carriage",
        url: "/master/precarriage",
        icon: Users,
      },
      {
        title: "Vendor",
        url: "/master/vendor",
        icon: Users,
      },
      {
        title: "CartonBox",
        url: "/master/cartonbox",
        icon: Users,
      },
      {
        title: "Product Description",
        url: "/master/product-description",
        icon: Users,
      },
      {
        title: "Duty Drawback",
        url: "/master/dutydrawback",
        icon: Users,
      },
    ],
  },

  {
    title: "Purchase",
    url: "/purchase",
    icon: Users,
  },
  {
    title: "Contract",
    url: "/contract",
    icon: Users,
  },
  {
    title: "Invoice",
    url: "/invoice",
    icon: Users,
  },
  {
    title: "Invoice Payment",
    url: "/invoice-payment",
    icon: Users,
  },
  {
    title: "Report",
    url: "#",
    icon: Settings,
    items: [
      {
        title: "Stock",
        url: "/report/stock",
        icon: Users,
      },
      {
        title: "Sales Account",
        url: "/report/sales-accounts",
        icon: Users,
      },
      {
        title: "DrawBack Report",
        url: "/report/dutydrawback",
        icon: Users,
      },
    ],
  },
  {
    title: "User Management",
    url: "/userManagement",
    icon: Frame,
  },
  {
    title: "UserType",
    url: "/user-type",
    icon: Frame,
  },
  {
    title: "Setting",
    url: "/setting",
    icon: Frame,
  },
];

const isAllowedByAPI = (item, pagePermissions, userId) => {
  if (!item?.url || item.url === "#") return true;

  const cleanUrl = item.url.replace(/^\//, "");

  return pagePermissions.some(
    (p) =>
      p.page === item.title &&
      p.url === cleanUrl &&
      p.userIds?.includes(String(userId)) &&
      p.status === "Active"
  );
};

const filterSidebarByAPI = (items, pagePermissions, userId) => {
  if (!Array.isArray(items)) return [];

  return items.reduce((acc, item) => {
    if (item.items?.length) {
      const children = filterSidebarByAPI(item.items, pagePermissions, userId);

      if (children.length > 0) {
        acc.push({ ...item, items: children });
      }
    } else if (isAllowedByAPI(item, pagePermissions, userId)) {
      acc.push(item);
    }

    return acc;
  }, []);
};

export function AppSidebar({ ...props }) {
  const [openItem, setOpenItem] = useState(null);
  const userId = useSelector((state) => state.auth.user.id);
  const user = useSelector((state) => state.auth.user);
  const company = useSelector(
    (state) => state?.company?.companyDetails?.company_name
  );
  const { pagePermissions } = useSelector((state) => state.permissions);
  const TEAMS_CONFIG = [
    {
      name: company,
      logo: GalleryVerticalEnd,
      plan: "",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ];
  const filteredNavMain = useMemo(() => {
    return filterSidebarByAPI(NAVIGATION_CONFIG, pagePermissions, userId);
  }, [pagePermissions, userId]);

  const sidebarData = {
    user: {
      name: user?.name || "User",
      email: user?.email || "user@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: TEAMS_CONFIG,
    navMain: filteredNavMain,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>

      <SidebarContent className="sidebar-content">
        <NavMain
          items={sidebarData.navMain}
          openItem={openItem}
          setOpenItem={setOpenItem}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

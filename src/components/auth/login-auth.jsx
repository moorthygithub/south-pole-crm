import { LOGIN } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { setCredentials } from "@/store/auth/authSlice";
import { setCompanyDetails } from "@/store/auth/companySlice";
import { setUsers } from "@/store/user/userSlice";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import BackgroundSVG from "./background-svg";
import Carousel from "./carousel";
import LoginForm from "./login-form";

const testimonials = [
  {
    image:
      "https://img.freepik.com/free-photo/large-cargo-ship-with-containers-open-sea-logistics-import-export_342744-1325.jpg?w=740",
    title: "Global Export Expertise",
    description:
      "South Pole specializes in international exports, delivering goods efficiently across global markets with proven logistics expertise.",
  },
  {
    image:
      "https://img.freepik.com/free-photo/warehouse-workers-checking-inventory-logistics-center_342744-1340.jpg?w=740",
    title: "End-to-End Supply Chain",
    description:
      "From sourcing to shipment, we manage the complete export supply chain ensuring accuracy, speed, and reliability.",
  },
  {
    image:
      "https://img.freepik.com/free-photo/businessman-analyzing-export-documents-office_342744-1203.jpg?w=740",
    title: "Export Documentation & Compliance",
    description:
      "We handle all export documentation, regulatory compliance, and certifications to ensure smooth customs clearance worldwide.",
  },
  {
    image:
      "https://img.freepik.com/free-photo/container-yard-logistics-import-export-business_342744-1333.jpg?w=740",
    title: "Trusted International Logistics",
    description:
      "Our strong network of shipping partners guarantees timely, secure, and cost-effective international deliveries.",
  },
  {
    image:
      "https://img.freepik.com/free-photo/global-business-network-connection-world-map_342744-1258.jpg?w=740",
    title: "Connecting Markets Worldwide",
    description:
      "South Pole bridges businesses across borders, helping clients expand globally with confidence and trust.",
  },
];

export default function AuthUI() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const emailInputRef = useRef(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { trigger: login, loading: isLoading } = useApiMutation();
  const dispatch = useDispatch();
  const loadingMessages = [
    "Setting things up...",
    "Checking credentials...",
    "Preparing dashboard...",
    "Almost there...",
  ];

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRotate]);

  useEffect(() => {
    if (!isLoading) return;
    let messageIndex = 0;
    setLoadingMessage(loadingMessages[0]);
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 800);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both username and password.");
      return;
    }

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    try {
      const res = await login({
        url: LOGIN.postLogin,
        method: "post",
        data: formData,
      });
      if (res?.code === 200) {
        const { UserInfo, version, year } = res;

        if (!UserInfo || !UserInfo.token) {
          toast.error("Login Failed: No token received.");
          return;
        }

        dispatch(
          setCredentials({
            token: UserInfo.token,
            user: UserInfo.user,
            version: version?.version_panel,
            currentYear: year?.current_year,
            tokenExpireAt: UserInfo.token_expires_at,
          })
        );
        dispatch(setUsers(res.userN));
        dispatch(setCompanyDetails(res?.company_detils));
      } else {
        toast.error(res.msg || "Login Failed: Unexpected response.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleCarouselChange = (direction) => {
    setAutoRotate(false);
    if (direction === "left") {
      setTestimonialIndex(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length
      );
    } else {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }
    setTimeout(() => setAutoRotate(true), 8000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      <BackgroundSVG />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-6xl w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            emailInputRef={emailInputRef}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
          />

          <Carousel
            testimonials={testimonials}
            testimonialIndex={testimonialIndex}
            handleCarouselChange={handleCarouselChange}
          />
        </div>
      </motion.div>
    </div>
  );
}

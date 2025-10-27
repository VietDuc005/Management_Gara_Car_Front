import React, { useState }  from "react";
import Loading from "./Loading";
import {
  Package,
  Layers,
  Wrench,
  ShoppingBag,
  Users,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const iconMap = {
  package: Package,
  layers: Layers,
  wrench: Wrench,
  "shopping-bag": ShoppingBag,
  users: Users,
  "file-text": FileText,
};

const BoxOnView = ({ title, fields = [] }) => {
  const navigate = useNavigate();
  const [loading] = useState(false);

  if (loading) return <Loading />;
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 transition-colors duration-300">
      {title && (
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-5">
          {title}
        </h2>
      )}

      <div className="
        grid gap-6
        [grid-template-columns:repeat(auto-fit,minmax(0,1fr))]
      ">
        {fields.map((item, index) => {
          const Icon = iconMap[item?.icon] || Package;

          return (
            <div
              key={index}
              onClick={() => item?.link && navigate(item.link)}
              className={`cursor-pointer group
                flex justify-between items-center gap-4 p-5 rounded-xl
                shadow-sm hover:shadow-lg transition-all duration-300
                border border-transparent hover:scale-[1.02]
                ${item?.bg ?? "bg-gray-100 dark:bg-gray-800"}
                ${item?.border ?? ""}
              `}
            >
              <div className={`p-3 rounded-lg bg-white/60 dark:bg-gray-900/40 
                ${item?.color ?? "text-gray-600"}`}>
                <Icon size={26} strokeWidth={1.6} />
              </div>

              <div className="flex flex-col items-end">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 line-clamp-2">
                  {item?.label ?? "Không rõ"}
                </span>
                <strong className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {item?.value?.toLocaleString("vi-VN") ?? "—"}
                </strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BoxOnView;

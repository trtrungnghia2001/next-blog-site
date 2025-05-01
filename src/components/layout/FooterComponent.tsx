import React, { memo } from "react";
import WrapperComponent from "./WrapperComponent";
import { footer_links } from "@/constants/link.constant";

const FooterComponent = () => {
  return (
    <div className="py-16 bg-footer-bg">
      <WrapperComponent className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
        <ul className="space-y-2">
          <li className="text-base font-medium mb-4">About</li>
          <li>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam
          </li>
          <li>
            <span>Email: </span>
            <span>info@jstemplate.net</span>
          </li>
          <li>
            <span>Phone: </span>
            <span>880 123 456 789</span>
          </li>
        </ul>
        <ul className="space-y-2">
          <li className="text-base font-medium mb-4">Quick Link</li>
          {footer_links.map((item, idx) => (
            <li key={idx}>{item.name}</li>
          ))}
        </ul>
        <ul className="space-y-2">
          <li className="text-base font-medium mb-4">Category</li>
          {footer_links.map((item, idx) => (
            <li key={idx}>{item.name}</li>
          ))}
        </ul>
      </WrapperComponent>
    </div>
  );
};

export default memo(FooterComponent);

"use client";
import dynamic from "next/dynamic";
import { FC, memo, useEffect, useMemo } from "react";
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});
import "react-quill-new/dist/quill.snow.css";
import "./style.css";
// editor
interface ReactNewQuillEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}
const ReactNewQuillEditor: FC<ReactNewQuillEditorProps> = ({
  value,
  onChange,
}) => {
  const toolbarOptions = useMemo(() => {
    return [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      ["link", "image", "video", "formula"],

      [{ header: 1 }, { header: 2 }, { header: 3 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button
    ];
  }, []);

  const qltoolbar = document.querySelector(".ql-toolbar") as HTMLElement;
  const qlcontainer = document.querySelector(".ql-container") as HTMLElement;
  useEffect(() => {
    if (qlcontainer && qltoolbar) {
      qlcontainer.style.paddingTop = `${qltoolbar.clientHeight}px`;
    }
  }, [qlcontainer, qltoolbar]);

  return (
    <ReactQuill
      id="react-quill-new"
      modules={{
        toolbar: toolbarOptions,
      }}
      theme="snow"
      value={value}
      onChange={onChange}
    />
  );
};

export default memo(ReactNewQuillEditor);

// view
interface ReactNewQuillViewProps {
  content: string;
}
export const ReactNewQuillView = ({ content }: ReactNewQuillViewProps) => {
  return (
    <div id="react-quill-new">
      <div className="ql-snow">
        <div
          className="ql-editor ql-view"
          dangerouslySetInnerHTML={{ __html: content || "" }}
        ></div>
      </div>
    </div>
  );
};

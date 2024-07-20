import moment from "moment/moment";

import HeadearSection from "../HeaderSection.jsx";
import QuotidiensSkeleton from "../skeleton/Quotidiens.skeleton.jsx";
import QViewer from "./QViewer.jsx";
import QCard from "./QCard.jsx";
import useQuotidien from "../../hook/useQuotidien.js";

export default function QSection() {
  const { quotidiens } = useQuotidien();

  return (
    <>
      <HeadearSection
        title={"Presses quotidiennes"}
        textButton={quotidiens ? moment(quotidiens?.createdTime).fromNow() : null}
      />

      <QViewer />

      <div className="flex flex-col">
        <div className="flex overflow-x-scroll no-scrollbar p-[16px]">
          <div className="flex flex-nowrap gap-2">
            {quotidiens ? (
              quotidiens.files.map((file, i) => <QCard file={file} key={file} index={i} />)
            ) : (
              <QuotidiensSkeleton />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

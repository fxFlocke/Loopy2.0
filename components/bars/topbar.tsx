import { InformationBar } from "./informationbar";
import {useContext, useEffect } from "react";
import { Configuration } from "@/datatypes/commondatatypes";
import { NodeBar } from "./nodebar";
import { EdgeBar } from "./edgebar";
import { EditingChoiceBar } from "./editingchoicebar";
import { AppContext } from "@/state/global";

export function Topbar() {
  const [appState, dispatch] = useContext(AppContext);

  useEffect(() => {
  }, [appState.config.editMode, appState.config.node])

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 items-center justify-start text-center w-full h-[120px] bg-[#28435a] rounded-2xl border-t border-b fixed">
        <EditingChoiceBar/>
        <div className="flex flex-shrink w-full gap-2 my-4">
          {appState.config.editMode === "node" && (
            <NodeBar/>
          )}
          {appState.config.editMode === "edge"  && (
            <EdgeBar/>
          )}
          {appState.config.editMode === "" && <InformationBar/>}
        </div>
      </div>
    </div>
  );
}

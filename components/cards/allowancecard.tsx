import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { AppContext } from "@/state/global";
import { getEdgeIdByPoint, getEdgeIndexByID, getNodeIndexByID } from "@/functionality/searcher";

export function AllowanceCard() {
    const [appState, dispatch] = useContext(AppContext);
    const [impactPosition, setImpactPosition] = useState("mt-1 ml-1")

    function detectInitialValue(){
        if(appState.config.editingIndex === -1 || appState.config.edgeEditingIndex === -1) {
          setImpactPosition("opacity-0")
          return
        }
        let node = appState.config.nodes[getNodeIndexByID(appState.config.editingIndex, appState.config.nodes)]
        let value = node.edges[getEdgeIndexByID(appState.config.edgeEditingIndex, node.edges)].edge.allowance
        switch(value){
          case -1:
            setImpactPosition("mt-2 ml-26")
            break
          case 0:
            setImpactPosition("opacity-0")
            break
          case 1:
            setImpactPosition("mt-2 ml-7.5")
            break
          default: 
            setImpactPosition("opacity-0")
        }
    }

    function detectValue(click: React.MouseEvent<HTMLElement>){
        if(appState.config.editingIndex === -1 || appState.config.edgeEditingIndex === -1){
          return
        }
        const {left, top} = click.currentTarget.getBoundingClientRect()
        const valuePoint = click.clientX - left
        let nodes = appState.config.nodes
        let nodeIndex = getNodeIndexByID(appState.config.editingIndex, appState.config.nodes)
        let node = nodes[nodeIndex]
        let edgeIndex = getEdgeIndexByID(appState.config.edgeEditingIndex, node.edges)
        if(valuePoint < 75 ){
          if (nodes[nodeIndex].edges[edgeIndex].edge.allowance !== 1){
            if(nodes[nodeIndex].edges[edgeIndex].geometry.labelDrawBase.l.includes("- -> ")){
                nodes[nodeIndex].edges[edgeIndex].geometry.labelDrawBase.l = nodes[nodeIndex].edges[edgeIndex].geometry.labelDrawBase.l.substring(5)
            }
            nodes[nodeIndex].edges[edgeIndex].edge.allowance = 1
            nodes[nodeIndex].edges[edgeIndex].geometry.labelDrawBase.l = "+ -> " + nodes[nodeIndex].edges[edgeIndex].geometry.labelDrawBase.l
            setImpactPosition("mt-2 ml-7.5")
          }else{
            nodes[nodeIndex].edges[edgeIndex].edge.allowance = 0
            if(nodes[nodeIndex].edges[edgeIndex].geometry.labelDrawBase.l.length > 1){
                nodes[nodeIndex].edges[edgeIndex].geometry.labelDrawBase.l = nodes[nodeIndex].edges[edgeIndex].geometry.labelDrawBase.l.substring(5)
            }
            setImpactPosition("opacity-0")
          }
        }else if(valuePoint < 150){
          if(nodes[nodeIndex].edges[edgeIndex].edge.allowance !== -1){   
            if(nodes[nodeIndex].edges[edgeIndex].geometry.labelDrawBase.l.includes("+ -> ")){
                nodes[nodeIndex].edges[edgeIndex].geometry.labelDrawBase.l = nodes[nodeIndex].edges[edgeIndex].geometry.labelDrawBase.l.substring(5)
            }
            nodes[nodeIndex].edges[edgeIndex].edge.allowance = -1
            nodes[nodeIndex].edges[edgeIndex].geometry.labelDrawBase.l = "- -> " + nodes[nodeIndex].edges[edgeIndex].geometry.labelDrawBase.l
            setImpactPosition("mt-2 ml-26")
          } else{
            nodes[nodeIndex].edges[edgeIndex].edge.allowance = 0
            if(nodes[nodeIndex].edges[edgeIndex].geometry.labelDrawBase.l.length > 1){
              nodes[nodeIndex].edges[edgeIndex].geometry.labelDrawBase.l = nodes[nodeIndex].edges[edgeIndex].geometry.labelDrawBase.l.substring(5)
            }
            setImpactPosition("opacity-0")
          }
        }
        dispatch({type:"EDIT", data: nodes})
    }

    
    useEffect(() => {
      detectInitialValue()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appState])

    return (
      <>
        <div className="grid grid-cols-1 w-[200px] place-items-center h-[90px] overflow-hidden rounded-lg shadow-lg bg-[#2b2d2d] normal-case">
          <div className="pt-[10px] pl-1 h-28">
            <label
              form="impact"
              className="pr-1 pb-4 text-sm font-light text-black dark:text-gray-300">
              Allowance
            </label>
            <Image
              src="/sliders/strength.png"
              alt="Profilbild"
              width={150}
              height={150}
              className="rounded-xl mt-1"
              onClick={(event) => detectValue(event)}
            />
            <Image
              src="/icons/upArrowWhite.png"
              alt="upArrow"
              width={15}
              height={15}
              className={impactPosition}
            />
          </div>
        </div>
      </>
    );
}

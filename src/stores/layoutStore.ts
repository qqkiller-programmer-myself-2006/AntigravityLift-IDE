// Graviton IDE - Panel Layout Store
// Manage panel positions and drag & drop

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PanelId = "explorer" | "search" | "git" | "debug" | "extensions" | "terminal" | "output" | "problems";

export interface PanelConfig {
    id: PanelId;
    title: string;
    visible: boolean;
    order: number;
    size?: number; // percentage or pixels
}

interface LayoutState {
    leftPanels: PanelConfig[];
    bottomPanels: PanelConfig[];
    rightPanels: PanelConfig[];

    // Actions
    movePanelToArea: (panelId: PanelId, fromArea: string, toArea: string, toIndex?: number) => void;
    reorderPanel: (area: string, fromIndex: number, toIndex: number) => void;
    togglePanelVisibility: (panelId: PanelId) => void;
    resetLayout: () => void;
}

const defaultLeftPanels: PanelConfig[] = [
    { id: "explorer", title: "Explorer", visible: true, order: 0 },
    { id: "search", title: "Search", visible: true, order: 1 },
    { id: "git", title: "Source Control", visible: true, order: 2 },
    { id: "debug", title: "Debug", visible: true, order: 3 },
    { id: "extensions", title: "Extensions", visible: true, order: 4 },
];

const defaultBottomPanels: PanelConfig[] = [
    { id: "terminal", title: "Terminal", visible: true, order: 0 },
    { id: "output", title: "Output", visible: true, order: 1 },
    { id: "problems", title: "Problems", visible: true, order: 2 },
];

const defaultRightPanels: PanelConfig[] = [];

export const useLayoutStore = create<LayoutState>()(
    persist(
        (set) => ({
            leftPanels: defaultLeftPanels,
            bottomPanels: defaultBottomPanels,
            rightPanels: defaultRightPanels,

            movePanelToArea: (panelId, fromArea, toArea, toIndex) => {
                set((state) => {
                    // Get source and target arrays
                    type PanelArea = "leftPanels" | "bottomPanels" | "rightPanels";
                    const areaMap: Record<string, PanelArea> = {
                        left: "leftPanels",
                        bottom: "bottomPanels",
                        right: "rightPanels",
                    };

                    const sourceKey = areaMap[fromArea];
                    const targetKey = areaMap[toArea];

                    if (!sourceKey || !targetKey) return state;

                    const sourceArray = [...state[sourceKey]];
                    const targetArray = fromArea === toArea ? sourceArray : [...state[targetKey]];

                    // Find and remove from source
                    const panelIndex = sourceArray.findIndex((p) => p.id === panelId);
                    if (panelIndex === -1) return state;

                    const [panel] = sourceArray.splice(panelIndex, 1);

                    // Add to target
                    const insertIndex = toIndex !== undefined ? toIndex : targetArray.length;
                    if (fromArea === toArea) {
                        sourceArray.splice(insertIndex, 0, panel);
                    } else {
                        targetArray.splice(insertIndex, 0, panel);
                    }

                    // Update order indices
                    const updateOrder = (arr: PanelConfig[]) =>
                        arr.map((p, i) => ({ ...p, order: i }));

                    if (fromArea === toArea) {
                        return { ...state, [sourceKey]: updateOrder(sourceArray) };
                    }

                    return {
                        ...state,
                        [sourceKey]: updateOrder(sourceArray),
                        [targetKey]: updateOrder(targetArray),
                    };
                });
            },

            reorderPanel: (area, fromIndex, toIndex) => {
                set((state) => {
                    const areaMap: Record<string, keyof Pick<LayoutState, "leftPanels" | "bottomPanels" | "rightPanels">> = {
                        left: "leftPanels",
                        bottom: "bottomPanels",
                        right: "rightPanels",
                    };

                    const key = areaMap[area];
                    if (!key) return state;

                    const panels = [...state[key]];
                    const [moved] = panels.splice(fromIndex, 1);
                    panels.splice(toIndex, 0, moved);

                    return {
                        ...state,
                        [key]: panels.map((p, i) => ({ ...p, order: i })),
                    };
                });
            },

            togglePanelVisibility: (panelId) => {
                set((state) => {
                    const toggleInArray = (arr: PanelConfig[]) =>
                        arr.map((p) =>
                            p.id === panelId ? { ...p, visible: !p.visible } : p
                        );

                    return {
                        leftPanels: toggleInArray(state.leftPanels),
                        bottomPanels: toggleInArray(state.bottomPanels),
                        rightPanels: toggleInArray(state.rightPanels),
                    };
                });
            },

            resetLayout: () =>
                set({
                    leftPanels: defaultLeftPanels,
                    bottomPanels: defaultBottomPanels,
                    rightPanels: defaultRightPanels,
                }),
        }),
        {
            name: "graviton-layout",
        }
    )
);

export default useLayoutStore;

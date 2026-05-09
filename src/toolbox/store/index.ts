import { create } from "zustand";
import IStore from "../../interfaces/store";
import { immer } from "zustand/middleware/immer";
import { withLenses } from "@dhmk/zustand-lens";
import { playerSlice } from "./player";
import { appSlice } from "./app";
import { enableMapSet } from "immer";
enableMapSet();

export const useStore = create<IStore>()(
  immer(
    withLenses<IStore>((..._globalArgs) => ({
      app: appSlice,
      player: playerSlice,
    })),
  ),
);

import IApp from "./app";
import IPlayer from "./player";

interface IStore {
  app: IApp;
  player: IPlayer;
}

export default IStore;

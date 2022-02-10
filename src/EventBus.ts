import mitt from "mitt";
const emitter = mitt();
const eventBus = () => {
  return { emitter };
};
export default eventBus;

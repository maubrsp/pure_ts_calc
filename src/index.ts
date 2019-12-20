import Initialization from "./core/Initialization";
import "./style.scss";
/**
 * init app
 */
const init = async () => {
  try {
    const initAsync = new Initialization();
    const bootstrap = await initAsync.init();
    return bootstrap;
  } catch (error) {}
};

/**
 * error handling
 */
const errorInit = async (error: any) => {
  console.error("Application init:", error);
  const body = document.body;
  body.className = "app_error";
};

init()
  .then(result => {
    if (result !== true) {
      errorInit(result);
    } else {
      console.log("Application init:", result);
    }
  })
  .catch(error => {
    errorInit(error);
  });

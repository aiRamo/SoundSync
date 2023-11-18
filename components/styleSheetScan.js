import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;
const ViewWidth = width * 0.28; // 90% of device width
const ViewHeight = ViewWidth * A4_RATIO;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    alignItems: "center",
    backgroundColor: "#483d8b",
    zIndex: 0,
  },
  gradientContainerScanner: {
    position: "absolute",
    alignSelf: "center",
    bottom: height * -1,
    height: height * 2.5,
    width: height * 3.5,
    backgroundColor: "#ffffff",
    zIndex: 5,
  },
  gradientContainerTracker: {
    position: "absolute",
    bottom: height * -2.5,
    left: width * -0.5,
    height: height * 3.5,
    width: height * 3.5,
    backgroundColor: "#251101",
    zIndex: 0,
  },
  gradient: {
    height: "100%",
    width: "100%",
  },
  scrollView: {},
  content: {
    width: width,
    height: height,
    alignItems: "center",
    alignSelf: "center",
    marginTop: height * 0.05,
  },
  imageList: {
    flexGrow: 1,
    width: width,
    top: -40,
  },
  pickImageButtonContainer: {
    width: ViewWidth,
    backgroundColor: "rgba(255,255,255,1)",
    height: ViewHeight,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.37,
    padding: 0,
    borderRadius: 15,
    marginTop: height * 0.02,
  },
  testButtonContainer: {
    position: "absolute",
    left: width * 0.7,
    top: height * 0.4,
    width: width * 0.065,
    height: height * 0.24,
    alignContent: "center",
    borderRadius: 12,
  },
  imagePreview: {
    resizeMode: "contain",
    width: "90%",
    height: "90%",
    alignSelf: "center",
  },
  serverMessage: {
    fontSize: 35,
    color: "rgba(255, 255, 255, 1)",
    textAlign: "center",
    fontWeight: "600",
    marginTop: 40,
    top: -120,
  },
  modalContainer: {
    height: height,
    width: width,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.40)",
  },
  introTitle: {
    fontSize: 35,
    fontWeight: "600",
    color: "#1B154C",
    textAlign: "center",
    marginTop: "1%",
    width: width * 0.8,
  },
  imageCounterBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: height * 0.075,
    left: 0,
    right: 0,
    zIndex: 8,
  },
  caretTouchable: {
    position: "absolute",
    top: height * 0.35,
    justifyContent: "center",
    alignItems: "center",
    width: 45,
    height: 45,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 50,
  },
  caretIcon: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  caretIconLeft: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    right: 2,
  },
  caretIconRight: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    left: 2,
  },
  downArrowIcon: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    alignSelf: "center",
  },
  imageCounterText: {
    position: "absolute",
    fontSize: 22,
    fontWeight: "400",
    color: "rgba(255,255,255,1)",
    textAlign: "center",
    top: 0,
  },
  nameInput: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    fontSize: 22,
    textAlign: "center",
    borderRadius: 24,
  },
  confirmNameButton: {
    backgroundColor: "#5B5593",
    width: width * 0.07,
    height: height * 0.05,
    borderRadius: 6,
    justifyContent: "center",
    alignSelf: "center",
    top: "42vh",
    opacity: 0.5,
  },
  modalTitle: {
    fontSize: 35,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    marginTop: height * 0.05,
  },
  modalImageView: {
    backgroundColor: "rgba(0,0,0,0)",
    alignSelf: "center",
    justifyContent: "center",
    height: ViewHeight,
    width: ViewWidth,
    marginTop: 5,
  },
  previewImage: {
    height: ViewHeight,
    width: ViewWidth,
    alignSelf: "center",
  },
  showNotesButton: {
    height: 30,
    width: 165,
    backgroundColor: "white",
    marginTop: 15,
    justifyContent: "center",
    borderRadius: 6,
    marginHorizontal: 15,
  },
  confirmScanButton: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 30,
    width: 165,
    backgroundColor: "white",
    justifyContent: "center",
    borderRadius: 6,
    zIndex: 12,
  },
  closeButton: {
    height: 30,
    width: 85,
    backgroundColor: "white",
    marginTop: 15,
    justifyContent: "center",
    borderRadius: 6,
    marginHorizontal: 15,
  },
  openButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  scanButtonText: {
    fontSize: 35,
    fontWeight: "600",
    color: "#1B154C",
    textAlign: "center",
  },
  blueButtonText: {
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "500",
    color: "blue", // Replace with your color
  },
  redButtonText: {
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "500",
    color: "red", // Replace with your color
  },
  namePropmtContent: {
    backgroundColor: "rgba(0,0,0,0)",
    flex: 1,
    top: 0,
    alignSelf: "center",
    zIndex: 4,
  },
  namePromptCard: {
    alignSelf: "center",
    justifyContent: "center",
    top: height * 0.2,
    backgroundColor: "white",
    width: width * 0.25,
    height: width * 0.25 * 0.25,
    borderRadius: 24,
  },
});

export default styles;

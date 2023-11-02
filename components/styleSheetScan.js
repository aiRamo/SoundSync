import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;
const ViewWidth = width * 0.26; // 90% of device width
const ViewHeight = ViewWidth * A4_RATIO;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#d6d6e6",
  },
  scrollView: {},
  content: {
    width: width,
    height: height,
    alignItems: "center",
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
    borderRadius: 24,
    top: "4vh",
  },
  testButtonContainer: {
    position: "absolute",
    width: "12vw",
    backgroundColor: "rgba(114, 110, 184, 1)",
    height: "4vh",
    top: "85vh",
    alignSelf: "center",
    justifyContent: "center",
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
    color: "rgba(0,0,0,1)",
    textAlign: "center",
    marginTop: " 2vh",
    marginBottom: height * 0,
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
    zIndex: 10,
  },
  caretTouchable: {
    position: "absolute",
    top: height * 0.35,
    justifyContent: "center",
    alignItems: "center",
    width: 45, // or some appropriate size
    height: 45, // or some appropriate size
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
    left: width * 0.32,
  },
  caretIconRight: {
    right: width * 0.32,
  },
  imageCounterText: {
    position: "absolute",
    fontSize: 22,
    fontWeight: "400",
    color: "rgba(0,0,0,1)",
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
    position: "absolute",
    backgroundColor: "rgba(114, 110, 184, 1)",
    width: width * 0.1,
    height: height * 0.075,
    borderRadius: 12,
    justifyContent: "center",
    alignSelf: "center",
    top: "42vh",
    opacity: 0.5,
  },
  modalTitle: {
    fontSize: 35,
    fontWeight: "600",
    color: "#F4F5FF",
    textAlign: "center",
    marginBottom: 20,
  },
  modalImageView: {
    backgroundColor: "rgba(0,0,0,0)",
    justifyContent: "center",
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
    borderRadius: 7,
    marginHorizontal: 15,
  },
  closeButton: {
    height: 30,
    width: 85,
    backgroundColor: "white",
    marginTop: 15,
    justifyContent: "center",
    borderRadius: 7,
    marginHorizontal: 15,
  },
  openButtonText: {
    color: "white",
    fontWeight: 600,
    alignSelf: "center",
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
    backgroundColor: "#d6d6e6",
    height: height,
    top: 0,
    alignSelf: "center",
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

import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;
const ViewWidth = width * 0.8; // 90% of device width
const ViewHeight = ViewWidth * A4_RATIO;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d6d6e6",
  },
  scrollView: {},
  content: {
    flex: 1,
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },
  imageList: { flexGrow: 1, width: width, top: -40 },
  pickImageButtonContainer: {
    width: width * 0.7,
    backgroundColor: "rgba(255,255,255,1)",
    height: height * 0.5,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.15,
    marginVertical: 15,
    borderRadius: 24,
    shadowColor: "#6b6b7c",
    shadowOffset: {
      width: 10,
      height: 20,
    },
    shadowOpacity: 0.9,
    shadowRadius: 20,
  },
  pickImageButtonImage: {
    resizeMode: "contain",
    height: "50%",
  },
  testButtonContainer: {
    position: "absolute",
    width: width * 0.3,
    backgroundColor: "rgba(114, 110, 184, 1)",
    height: height * 0.045,
    bottom: height * 0.105,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  imagePreview: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
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
    borderRadius: 15,
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
    marginTop: height * 0.02,
    marginBottom: height * 0,
    width: width * 0.8,
  },
  nameInput: {
    height: "60%",
    width: "90%",
    alignSelf: "center",
    fontSize: 22,
    textAlign: "center",
  },
  confirmNameButton: {
    position: "absolute",
    backgroundColor: "rgba(114, 110, 184, 1)",
    width: width * 0.33,
    height: width * 0.33 * 0.33,
    borderRadius: 12,
    justifyContent: "center",
    alignSelf: "center",
    top: height * 0.53,
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
    position: "absolute",
    top: 0,
  },
  namePromptCard: {
    alignSelf: "center",
    justifyContent: "center",
    top: height * 0.25,
    backgroundColor: "white",
    width: width * 0.66,
    height: width * 0.66 * 0.3,
    borderRadius: 24,
    shadowColor: "#6b6b7c",
    shadowOffset: {
      width: 10,
      height: 20,
    },
    shadowOpacity: 0.9,
    shadowRadius: 20,
  },
});

export default styles;

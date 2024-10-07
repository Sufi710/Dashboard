document.addEventListener("DOMContentLoaded", function () {
    const menuLinks = document.querySelectorAll(".menu a");
    const loadingMessage = document.getElementById("loadingMessage");
    const popupContainer = document.getElementById("popupContainer");
    const popupMessage = document.getElementById("popupMessage");
    const closePopup = document.getElementById("closePopup");

    const medicalTerms = [
        { label: "Temperature", spec: "Temperature", unit: "°F" },
        { label: "Heart Rate", spec: "HeartRate", unit: "bpm" },
        { label: "SpO2", spec: "SPO2", unit: "%" },
        { label: "Weight", spec: "Weight", unit: "kg" },
        { label: "Height", spec: "Height", unit: "cm" },
        { label: "Glucose level", spec: "Glucose", unit: "mg/dL" },
        { label: "Blood Pressure", spec: "BloodPressure", unit: "mmHg" },
        { label: "BMI", spec: "BMI", unit: "" },
    ];

    const apiUrls = {
        "Temperature": "http://192.168.0.3:2500/Temperature",
        "HeartRate": "http://192.168.0.3:2500/HeartRate",
        "Weight": "http://192.168.0.3:2500/Weight",
        "Glucose": "http://192.168.0.3:2500/Glucose",
        "BloodPressure": "http://192.168.0.3:2500/BloodPressure",
    };

    let isFetching = false;
    const resultBlocks = {};
    const heartRateSelected = false;

    // Initialize result blocks for each medical term
    medicalTerms.forEach(term => {
        resultBlocks[term.spec] = document.querySelector(`.result-box[data-spec="${term.spec}"] .spec-value`);
    });

    // Add click event listeners to menu links
    menuLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const spec = link.getAttribute("data-spec");

            if (isFetching) {
                showPopupMessage("Please wait for the result");
                setTimeout(hidePopupMessage, 2000); // Automatically hide after 2 seconds
                return;
            }

            switch (spec) {
                case "Temperature":
                    handleTemperatureClick();
                    break;
                case "HeartRate":
                    handleHeartRateClick();
                    break;
                case "Weight":
                    handleWeightClick();
                    break;
                case "BloodPressure":
                    handleBPClick();
                    break;
                    case "Glucose":
                    handleGlucoseClick();
                    break;
                    
                    
                default:
                    
            }
        });
    });

    function handleTemperatureClick() {
        isFetching = true;
        showLoadingMessage("Loading Temperature °F...");
        const apiUrl = apiUrls["Temperature"];

        fetch(apiUrl, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                const TemperatureValue = data.Temperature + "°F ";
                updateResult("Temperature", TemperatureValue);
                isFetching = false;
                hideLoadingMessage();
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                isFetching = false;
                hideLoadingMessage();
            });
    }

    function handleHeartRateClick() {
        isFetching = true;
        showLoadingMessage("Loading HeartRate and SpO2...");
        const apiUrl = apiUrls["HeartRate"];

        fetch(apiUrl, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                const heartRateValue = data.HR + " bpm";
                const spo2Value = data.SPO2 + " %";
                updateResult("HeartRate", heartRateValue);
                updateResult("SPO2", spo2Value);

                isFetching = false;
                hideLoadingMessage();
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                isFetching = false;
                hideLoadingMessage();
            });
    }

    function handleWeightClick() {
        isFetching = true;
        showLoadingMessage("Loading Weight, Height, and BMI...");
        const apiUrl = apiUrls["Weight"];

        fetch(apiUrl, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                const weightValue = data.Weight + " kg";
                const bmiValue = data.BMI;
                const heightValue = data.Height + " cm";
                updateResult("Weight", weightValue);
                updateResult("BMI", bmiValue);
                updateResult("Height", heightValue);

                isFetching = false;
                hideLoadingMessage();
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                isFetching = false;
                hideLoadingMessage();
            });
    }
    function handleGlucoseClick() {
        isFetching = true;
        showLoadingMessage("loading Glucose...");
        const apiUrl = apiUrls["Glucose"];

        fetch(apiUrl, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                const GlucoseValue = data.Glucose + "mg/dl";
                updateResult("Glucose", GlucoseValue);
                isFetching = false;
                hideLoadingMessage();
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                isFetching = false;
                hideLoadingMessage();
            });
    }

    function handleBPClick() {
        isFetching = true;
        showLoadingMessage("Loading Blood Pressure...");
        const apiUrl = apiUrls["BloodPressure"];

        fetch(apiUrl, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                const bpValue = `${data.DIA}/${data.SYS} mmHg`;
                updateResult("BloodPressure", bpValue);
                isFetching = false;
                hideLoadingMessage();
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                isFetching = false;
                hideLoadingMessage();
            });
    }

    function updateResult(spec, value) {
        const specValue = resultBlocks[spec];
        if (specValue) {
            specValue.textContent = value;
            const ledIndicator = specValue.parentElement.querySelector(".led-indicator");
            if (ledIndicator) {
                ledIndicator.classList.add("led-green");
            }
        }
    }

    function showLoadingMessage(message) {
        loadingMessage.textContent = message;
        loadingMessage.style.display = "block";
    }

    function hideLoadingMessage() {
        loadingMessage.style.display = "none";
    }

    function showPopupMessage(message) {
        popupMessage.textContent = message;
        popupContainer.style.display = "flex";
    }

    function hidePopupMessage() {
        popupContainer.style.display = "none";
    }

    closePopup.addEventListener("click", function () {
        popupContainer.style.display = "none";
    });

    function getTermLabel(spec) {
        const term = medicalTerms.find(item => item.spec === spec);
        return term ? term.label : spec;
    }
});

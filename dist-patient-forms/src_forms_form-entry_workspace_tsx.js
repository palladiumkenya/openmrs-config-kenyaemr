"use strict";
(globalThis["webpackChunk_openmrs_esm_patient_forms_app"] = globalThis["webpackChunk_openmrs_esm_patient_forms_app"] || []).push([["src_forms_form-entry_workspace_tsx"],{

/***/ "./src/forms/form-entry.workspace.tsx":
/*!********************************************!*\
  !*** ./src/forms/form-entry.workspace.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_2__);
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}



var FormEntry = function(param) {
    var patientUuid = param.patientUuid, patient = param.patient, _param_clinicalFormsWorkspaceName = param.clinicalFormsWorkspaceName, clinicalFormsWorkspaceName = _param_clinicalFormsWorkspaceName === void 0 ? _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_2__.clinicalFormsWorkspace : _param_clinicalFormsWorkspaceName, closeWorkspace = param.closeWorkspace, closeWorkspaceWithSavedChanges = param.closeWorkspaceWithSavedChanges, promptBeforeClosing = param.promptBeforeClosing, mutateForm = param.mutateForm, formInfo = param.formInfo;
    var _currentVisit_visitType;
    var _ref = formInfo || {}, encounterUuid = _ref.encounterUuid, formUuid = _ref.formUuid, visitStartDatetime = _ref.visitStartDatetime, visitStopDatetime = _ref.visitStopDatetime, visitTypeUuid = _ref.visitTypeUuid, visitUuid = _ref.visitUuid, additionalProps = _ref.additionalProps;
    var currentVisit = (0,_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_2__.useVisitOrOfflineVisit)(patientUuid).currentVisit;
    var _useState = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true), 2), showForm = _useState[0], setShowForm = _useState[1];
    var isOnline = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.useConnectivity)();
    var state = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function() {
        var _currentVisit_visitType;
        var _ref, _ref1, _ref2, _ref3;
        return {
            view: "form",
            formUuid: formUuid !== null && formUuid !== void 0 ? formUuid : null,
            visitUuid: (_ref = visitUuid !== null && visitUuid !== void 0 ? visitUuid : currentVisit === null || currentVisit === void 0 ? void 0 : currentVisit.uuid) !== null && _ref !== void 0 ? _ref : null,
            visitTypeUuid: (_ref1 = visitTypeUuid !== null && visitTypeUuid !== void 0 ? visitTypeUuid : currentVisit === null || currentVisit === void 0 ? void 0 : (_currentVisit_visitType = currentVisit.visitType) === null || _currentVisit_visitType === void 0 ? void 0 : _currentVisit_visitType.uuid) !== null && _ref1 !== void 0 ? _ref1 : null,
            visitStartDatetime: (_ref2 = visitStartDatetime !== null && visitStartDatetime !== void 0 ? visitStartDatetime : currentVisit === null || currentVisit === void 0 ? void 0 : currentVisit.startDatetime) !== null && _ref2 !== void 0 ? _ref2 : null,
            visitStopDatetime: (_ref3 = visitStopDatetime !== null && visitStopDatetime !== void 0 ? visitStopDatetime : currentVisit === null || currentVisit === void 0 ? void 0 : currentVisit.stopDatetime) !== null && _ref3 !== void 0 ? _ref3 : null,
            isOffline: !isOnline,
            patientUuid: patientUuid !== null && patientUuid !== void 0 ? patientUuid : null,
            patient: patient,
            encounterUuid: encounterUuid !== null && encounterUuid !== void 0 ? encounterUuid : null,
            closeWorkspace: function() {
                typeof mutateForm === "function" && mutateForm();
                closeWorkspace();
            },
            closeWorkspaceWithSavedChanges: function() {
                typeof mutateForm === "function" && mutateForm();
                closeWorkspaceWithSavedChanges();
            },
            promptBeforeClosing: promptBeforeClosing,
            additionalProps: additionalProps,
            clinicalFormsWorkspaceName: clinicalFormsWorkspaceName
        };
    }, [
        formUuid,
        visitUuid,
        visitTypeUuid,
        encounterUuid,
        visitStartDatetime,
        visitStopDatetime,
        currentVisit === null || currentVisit === void 0 ? void 0 : currentVisit.uuid,
        currentVisit === null || currentVisit === void 0 ? void 0 : (_currentVisit_visitType = currentVisit.visitType) === null || _currentVisit_visitType === void 0 ? void 0 : _currentVisit_visitType.uuid,
        currentVisit === null || currentVisit === void 0 ? void 0 : currentVisit.startDatetime,
        currentVisit === null || currentVisit === void 0 ? void 0 : currentVisit.stopDatetime,
        patientUuid,
        patient,
        isOnline,
        mutateForm,
        closeWorkspace,
        closeWorkspaceWithSavedChanges,
        promptBeforeClosing,
        additionalProps,
        clinicalFormsWorkspaceName
    ]);
    // FIXME: This logic triggers a reload of the form when the formUuid changes. It's a workaround for the fact that the form doesn't reload when the formUuid changes.
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function() {
        if (state.formUuid) {
            setShowForm(false);
            setTimeout(function() {
                setShowForm(true);
            });
        }
    }, [
        state
    ]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.ExtensionSlot, {
        name: "visit-context-header-slot",
        state: {
            patientUuid: patientUuid
        }
    }), showForm && formInfo && patientUuid && patient && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.ExtensionSlot, {
        name: "form-widget-slot",
        state: state
    }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormEntry);


/***/ })

}]);
//# sourceMappingURL=src_forms_form-entry_workspace_tsx.js.map
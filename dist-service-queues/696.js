"use strict";(globalThis.webpackChunk_openmrs_esm_service_queues_app=globalThis.webpackChunk_openmrs_esm_service_queues_app||[]).push([[696],{4696:(e,u,t)=>{t.r(u),t.d(u,{default:()=>o});var i=t(5206),n=t.n(i),r=t(4924),s=t(6124),d=t(7702),l=t(2312);const o=function(e){var u=e.queueEntry,t=e.closeModal,i=(0,r.useTranslation)().t,o=(0,l.y)().queues;return n().createElement(s.Z,{queueEntry:u,closeModal:t,modalParams:{modalTitle:i("editQueueEntry","Edit queue entry"),modalInstruction:i("editQueueEntryInstruction","Edit fields of existing queue entry"),submitButtonText:i("editQueueEntry","Edit queue entry"),submitSuccessTitle:i("queueEntryEdited","Queue entry edited"),submitSuccessText:i("queueEntryEditedSuccessfully","Queue entry edited successfully"),submitFailureTitle:i("queueEntryEditingFailed","Error editing queue entry"),submitAction:function(e,u){var t=o.find((function(e){return e.uuid==u.selectedQueue})),i=null==t?void 0:t.allowedStatuses,n=null==t?void 0:t.allowedPriorities;return(0,d.zI)(e.uuid,{status:i.find((function(e){return e.uuid==u.selectedStatus})),priority:n.find((function(e){return e.uuid==u.selectedPriority})),priorityComment:u.prioritycomment})},disableSubmit:function(){return!1}}})}}}]);
var $1IPHz$reactariautils = require("@react-aria/utils");
var $1IPHz$reactariabutton = require("@react-aria/button");
var $1IPHz$reactariaselection = require("@react-aria/selection");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "useAccordionItem", () => $b655721e1e8aa6ea$export$dfe72e7a237bd184);
$parcel$export(module.exports, "useAccordion", () => $b655721e1e8aa6ea$export$35e88b08325f7140);
/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ 


function $b655721e1e8aa6ea$export$dfe72e7a237bd184(props, state, ref) {
    let { item: item } = props;
    let buttonId = (0, $1IPHz$reactariautils.useId)();
    let regionId = (0, $1IPHz$reactariautils.useId)();
    let isDisabled = state.disabledKeys.has(item.key);
    let { itemProps: itemProps } = (0, $1IPHz$reactariaselection.useSelectableItem)({
        selectionManager: state.selectionManager,
        key: item.key,
        ref: ref
    });
    let { buttonProps: buttonProps } = (0, $1IPHz$reactariabutton.useButton)((0, $1IPHz$reactariautils.mergeProps)(itemProps, {
        id: buttonId,
        elementType: 'button',
        isDisabled: isDisabled,
        onPress: ()=>state.toggleKey(item.key)
    }), ref);
    let isExpanded = state.expandedKeys.has(item.key);
    return {
        buttonProps: {
            ...buttonProps,
            'aria-expanded': isExpanded,
            'aria-controls': isExpanded ? regionId : undefined
        },
        regionProps: {
            id: regionId,
            role: 'region',
            'aria-labelledby': buttonId
        }
    };
}
function $b655721e1e8aa6ea$export$35e88b08325f7140(props, state, ref) {
    let { listProps: listProps } = (0, $1IPHz$reactariaselection.useSelectableList)({
        ...props,
        ...state,
        allowsTabNavigation: true,
        disallowTypeAhead: true,
        ref: ref
    });
    return {
        accordionProps: {
            ...listProps,
            tabIndex: undefined
        }
    };
}


//# sourceMappingURL=useAccordion.main.js.map

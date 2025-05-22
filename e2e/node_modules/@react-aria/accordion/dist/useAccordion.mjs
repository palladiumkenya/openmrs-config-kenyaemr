import {useId as $1bneI$useId, mergeProps as $1bneI$mergeProps} from "@react-aria/utils";
import {useButton as $1bneI$useButton} from "@react-aria/button";
import {useSelectableItem as $1bneI$useSelectableItem, useSelectableList as $1bneI$useSelectableList} from "@react-aria/selection";

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


function $fdb8889d8fd9a904$export$dfe72e7a237bd184(props, state, ref) {
    let { item: item } = props;
    let buttonId = (0, $1bneI$useId)();
    let regionId = (0, $1bneI$useId)();
    let isDisabled = state.disabledKeys.has(item.key);
    let { itemProps: itemProps } = (0, $1bneI$useSelectableItem)({
        selectionManager: state.selectionManager,
        key: item.key,
        ref: ref
    });
    let { buttonProps: buttonProps } = (0, $1bneI$useButton)((0, $1bneI$mergeProps)(itemProps, {
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
function $fdb8889d8fd9a904$export$35e88b08325f7140(props, state, ref) {
    let { listProps: listProps } = (0, $1bneI$useSelectableList)({
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


export {$fdb8889d8fd9a904$export$dfe72e7a237bd184 as useAccordionItem, $fdb8889d8fd9a904$export$35e88b08325f7140 as useAccordion};
//# sourceMappingURL=useAccordion.module.js.map

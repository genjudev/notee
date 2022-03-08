import * as React from 'react';
import {setConnector, dispatch, getStore} from 'imus';

const NAME_STORE = 'store';

export default function useStore(initTabs: any) {
    const [tabs, setTabs] =
        React.useState<{name: string; id: number; content: string}[]>(initTabs);
    const [tabActive, setTabActive] = React.useState(0);
    const [lastSave, setLastSave] = React.useState('');

    if (initTabs) dispatch('tabs', initTabs);

    const createTab = () => {
        const newTabs = [
            ...tabs,
            {
                name: `Tab ${tabs.length}`,
                id: tabs.length,
                content: '',
            },
        ];
        dispatch('tabs', newTabs);
        dispatch('tab_active', tabs.length);
        setTabs(newTabs);
        setTabActive(tabs.length);
    };

    const updateData = async () => {
        const res = await fetch('https://notee.chimpsol.com/api/tabs', {
            method: 'POST',
            body: JSON.stringify({tabs}),
        });
        if (res.ok) {
            const json = await res.json();
            const _date = new Date().toString();
            setLastSave(_date);
            dispatch('tabs', tabs);
            dispatch('last_save', _date);
        }
    };

    const changeTab = (tabId: number) => {
        setTabActive(tabId);
        dispatch('tab_active', tabId);
    };

    const updateTab = (id: number, value: string) => {
        const newTabs = tabs.map((tab) => {
            if (tab.id === id) {
                tab.content = value;
            }
            return tab;
        });
        dispatch('tabs', newTabs);
        setTabs(newTabs);
    };

    React.useEffect(() => {
        const setter = (store: any) =>
            localStorage.setItem(NAME_STORE, JSON.stringify(store));
        const getter = () =>
            JSON.parse(localStorage.getItem(NAME_STORE) || '{}');

        //@ts-ignore
        setConnector(setter, getter);
        const _tabs = getStore('tabs');
        setTabs(_tabs || []);
        setTabActive(getStore('tab_active') || 0);
        setLastSave(getStore('last_save') || '');

        if (!_tabs) {
            createTab();
        }
    }, []);
    return {
        tabs,
        tabActive,
        lastSave,
        createTab,
        updateTab,
        changeTab,
        updateData,
    };
}

import { usePopover } from '@patch-kit/popover';

export interface ButtonItem {
    type: 'button';
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
}

export interface SeparatorItem {
    type: 'separator';
}

export type MenuItem = ButtonItem | SeparatorItem;

interface MenuProps {
    items: MenuItem[];
}

const Menu = ({ items }: MenuProps) => {
    const { closePopover } = usePopover();

    return (
        <div
            className='context-menu rounded-md shadow-lg py-1 min-w-[160px]'
            onClick={() => closePopover()}
        >
            {items.map((item, i) => {
                if (item.type === 'separator') {
                    return <hr key={i} className='my-1 border-t border-white/10' />;
                }
                return (
                    <button
                        key={item.id}
                        className='context-menu__item flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left'
                        onClick={item.onClick}
                    >
                        <span className='flex-shrink-0 opacity-70'>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default Menu;

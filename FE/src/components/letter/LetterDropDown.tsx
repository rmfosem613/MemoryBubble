import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

interface LetterDropdown {
  id: string;
  label: string;
}

interface DropdownMenuProps {
  options: LetterDropdown[];
  placeholder?: string;
  onSelect: (option: LetterDropdown) => void;
  selectedOption?: LetterDropdown | null;
}

function LetterDropdown({
  options,
  placeholder = '선택하세요',
  onSelect,
  selectedOption
}: DropdownMenuProps) {
  return (
    <Menu as="div" className="relative z-30 inline-block w-full pr-[12px] text-left mb-[30px]">
      <div>
        <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-[8px] bg-white px-3 py-2 text-p-sm  ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 w-[211px] origin-top-right divide-y divide-gray-100 mr-[13px] rounded-md bg-white ring-1 shadow-sm ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        {options.map((option) => (
          <div className="py-1" key={option.id}>
            <MenuItem>
              {({ active }) => (
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                  onClick={() => onSelect(option)}
                >
                  {option.label}
                </button>
              )}
            </MenuItem>
          </div>
        ))}
      </MenuItems>
    </Menu>
  );
}

export default LetterDropdown;
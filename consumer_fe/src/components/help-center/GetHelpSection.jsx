import { Link } from 'react-router-dom';
import { Reveal } from '../motion';
import Images from '../../utils/Images';
import ContactInfoCards from '../contact/ContactInfoCards';

export default function GetHelpSection() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <Reveal variant="fadeUp" amount={0.15}>
        <div className="rounded-2xl bg-[#E8ECF8] px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
            <div className="relative shrink-0">
              <div className="flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
                <img
                  src={Images.contact_us.help_desk}
                  alt="Customer support"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-[#0B1354] sm:text-3xl">Get Help</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#5B5F7B] sm:text-base">
                We can only fix issues we know about.{' '}
                <Link to="/contact" className="font-medium text-primary hover:text-primary/80">
                  Contact us now!
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      <ContactInfoCards />
    </div>
  );
}

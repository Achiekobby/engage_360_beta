import { clsx } from "clsx";
import { Link } from "react-router";
import Images from "../../utils/Images";
import { useAppSelector } from "../../store/hooks";

/**
 * Engage360 wordmark.
 * `on-white` is the blue logo for light surfaces.
 * `on-primary` is the white logo for blue or dark surfaces.
 */
export default function LogoMark({
  className,
  variant = "on-primary",
  size = 48,
  to,
  linked = true,
}) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const onLight = variant === "on-white";
  const destination = to ?? (isAuthenticated ? "/dashboard" : "/");
  const image = (
    <img
      src={onLight ? Images.logo : Images.logoWhite}
      alt=""
      height={size}
      className={clsx("w-auto shrink-0 object-contain", className)}
      style={{ height: size }}
    />
  );

  if (!linked) return image;

  return (
    <Link to={destination} aria-label="Engage360 home">
      {image}
    </Link>
  );
}

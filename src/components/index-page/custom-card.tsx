import React from "react";
import * as Card from "../ui/card";
import { cn } from "@/libs/utils";

type CardProps = React.ComponentProps<typeof Card.Root>;
interface Props extends CardProps {
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
}

const CustomCard: React.FC<Props> = ({ className, header, body, footer, ...props }) => {
  return (
    <Card.Root className={cn("w-[380px]", className)} {...props}>
      {header && <Card.Header>{header}</Card.Header>}
      {body && <Card.Content className="grid gap-4">{body}</Card.Content>}
      {footer && <Card.Footer>{footer}</Card.Footer>}
    </Card.Root>
  );
};

export default CustomCard;

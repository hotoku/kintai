import { Component, ErrorInfo, ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

type State = {
  hasError: boolean;
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log("error: ", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <h1>error</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

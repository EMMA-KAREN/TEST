import "@testing-library/jest-dom";
import { expect } from "@jest/globals";
import { TextEncoder, TextDecoder } from "util";

// Ensure TextEncoder and TextDecoder are available
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Ensure expect is globally available
global.expect = expect;

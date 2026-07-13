#!/usr/bin/env python3
"""
Legacy entrypoint — generates icons from app-icon.svg via Node.

  node src-tauri/icons/generate-icons.mjs
"""
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
SCRIPT = os.path.join(HERE, "generate-icons.mjs")


def main() -> int:
    print("Generating CloudPlay icons from app-icon.svg …")
    result = subprocess.run(
        ["node", SCRIPT],
        cwd=ROOT,
        check=False,
    )
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())

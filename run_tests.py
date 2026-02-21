#!/usr/bin/env python3
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SUITE = unittest.defaultTestLoader.discover(str(ROOT / "tests"), pattern="test_*.py")
RESULT = unittest.TextTestRunner(verbosity=2).run(SUITE)
sys.exit(0 if RESULT.wasSuccessful() else 1)

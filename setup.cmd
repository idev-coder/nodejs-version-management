@echo off
for /f "skip=2 tokens=2,*" %%A in ('reg query "HKLM\\System\\CurrentControlSet\\Control\\Session Manager\\Environment" /v Path 2^>nul') do (
  setx PATH "%%B;%%N_HOME%%;%%N_SYMLINK%%"
)
@echo on
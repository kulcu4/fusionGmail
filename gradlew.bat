@ECHO OFF

SETLOCAL

set DIRNAME=%~dp0
IF "%DIRNAME%" == "" SET DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

set CLASSPATH=%APP_HOME%\gradle\wrapper\gradle-wrapper.jar

IF NOT EXIST "%CLASSPATH%" (
  ECHO Gradle wrapper JAR not found. Please run 'gradlew wrapper'.
  EXIT /B 1
)

set DEFAULT_JVM_OPTS="-Xmx64m" "-Xms64m"

IF DEFINED JAVA_HOME (
  set JAVA_EXE=%JAVA_HOME%\bin\java.exe
) ELSE (
  set JAVA_EXE=java
)

"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %GRADLE_OPTS% -Dorg.gradle.appname=%APP_BASE_NAME% -classpath "%CLASSPATH%" org.gradle.wrapper.GradleWrapperMain %*

ENDLOCAL

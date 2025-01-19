# FormQuickEditPCF

FormQuickEditPCF is a Power Apps Grid Control extention that allows user to overwrite column with button that opens highly customizable Fluent UI dialog, that allows one to read and update data.

## Features

- **Row Data Read and Write**: Allows to add row's fields into the form for reading and writing operations
- **Seamless Integration**: Easily integrates with Power Apps Grid Control component.
- **Customizable**: Offers flexibility to define specific actions for different key events, tailored to application requirements.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Power Apps CLI](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/powerapps-cli)
- [Visual Studio Code](https://code.visualstudio.com/) or another code editor

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/dovgri1/CanvasKeyDownPcf.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd CanvasKeyDownPcf/CanvasKeyDownPcf/CanvasKeyDownPcf
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

## Building the Control

To build the PCF control, run:

```bash
npm run build
```

This command compiles the TypeScript code and prepares the control for deployment.

## Deployment

1. **Update ControlManifest.Input.xml file for custom component name**:
   
    <control namespace="<YourNameSpace>" constructor="<ConstructorName>" version="0.0.1" display-name-key="<Display Name>" description-key="<Description>" control-type="virtual">

2. **Update configuration.ts file for your environment variables and styling preferences**:
    
3. **Authenticate with Power Platform Environment**:

   ```bash
   pac auth create --url https://your-environment-url
   ```

   Replace `https://your-environment-url` with the URL of your Power Platform environment.

4. **Push the Control to Your Environment**:

   ```bash
   pac pcf push --publisher-prefix yourprefix
   ```

   Replace `yourprefix` with your publisher prefix.

## Usage

After deployment, you can add the FormQuickEditPCF control to your Model-Driven app:

1. Open your Model-Driven apps in Power Apps Editor.
2. Navigate to particular Entity in Classic Designer! There is some sort of bug in modern designer when applying grid customizer for Power Apps Grid Control.
3. Apply and configure power apps grid control for Particular View or Subgrid inside of entity form.
4. Save and publish.
5. Debug and check why it's not working.

Reference documentation for additional info on Power Apps Grid Control

## Contributing

Contributions are welcome! If you encounter issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. It is free to use, modify, and distribute for any purpose, ensuring accessibility for everyone. See the [LICENSE](LICENSE) file for full details.

## Acknowledgments

Special thanks to the Power Apps community for their continuous support and contributions.

For more information on building PCF controls, refer to the [Power Apps component framework documentation](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/overview).

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '../../../components/atoms';
import { Screen } from './../../../components/templates';
import ForgotPasswordForm from '../components/organisms/ForgotPasswordForm';
import OTPVerification from '../components/organisms/OTPVerification';
import SetNewPassword from '../components/organisms/SetNewPassword';
import PasswordUpdateSuccess from '../components/organisms/PasswordUpdateSuccess';

const PasswordRecovery = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');

  const handleSecondScreen = () => {
    setStep(2);
  };

  const onOtpReceived = (otp: string) => {
    setOtp(otp);
    setStep(2);
  };

  const handleNextToSetPassword = () => {
    setStep(3);
  };

  const handlePasswordUpdated = () => {
    setStep(4);
  };

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        title: (
          <Text
            variant="title"
            size="medium"
            color="info"
            style={{ marginTop: 8 }}
          >
            {t('passwordRecovery.title', 'Forgot Password')}
          </Text>
        ),
      }}
    >
      {step === 1 && (
        <ForgotPasswordForm handleSecondScreen={handleSecondScreen} />
      )}
      {step === 2 && (
        <OTPVerification
          onOtpReceived={onOtpReceived}
          onNext={handleNextToSetPassword}
        />
      )}
      {step === 3 && (
        <SetNewPassword otp={otp} onSuccess={handlePasswordUpdated} />
      )}
      {step === 4 && <PasswordUpdateSuccess />}
    </Screen>
  );
};

export default PasswordRecovery;
